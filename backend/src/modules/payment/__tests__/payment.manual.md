# Payment Integration — Manual Test Sequences

## Prerequisites
- Backend running: `cd Everlive-website/Backend && npm run dev`
- MongoDB connected and `PAYU_MERCHANT_KEY`, `PAYU_MERCHANT_SALT` set in `Backend/.env`
- A valid Order `_id` in status `PENDING_PAYMENT` (create one via POST /api/v1/orders first)
- A valid customer JWT token from POST /api/v1/auth/phone/verify-otp or /auth/admin/login
- For GoKwik webhook tests: ngrok running — `ngrok http 5000` — register the HTTPS URL in the GoKwik dashboard

---

## TEST 1 — PayU: Initiate Payment

```bash
curl -X POST http://localhost:5000/api/v1/payments/payu/initiate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <customer_token>" \
  -d '{
    "orderId": "<valid_order_id>",
    "firstname": "Test",
    "email": "test@example.com",
    "phone": "9876543210"
  }'
```

**Expected 200:**
```json
{
  "success": true,
  "data": {
    "key": "gtKFFx",
    "txnid": "EVL_1234567890_ABC123",
    "amount": "999.00",
    "productinfo": "Everlive Order ORD-xxx",
    "firstname": "Test",
    "email": "test@example.com",
    "phone": "9876543210",
    "surl": "http://localhost:5000/api/v1/payments/payu/success",
    "furl": "http://localhost:5000/api/v1/payments/payu/failure",
    "hash": "<sha512_hash>",
    "payuBaseUrl": "https://test.payu.in/_payment"
  }
}
```

The frontend form-POSTs these fields to `payuBaseUrl` to redirect the user to PayU's hosted checkout.

**Check DB:** Order remains in `PENDING_PAYMENT` until PayU posts to /payu/success.

---

## TEST 2 — PayU: Simulate Success Callback

PayU posts to this endpoint after payment. Use test credentials (key=gtKFFx, salt=eCwWZ3Bj).

Compute the response hash:
```bash
# sha512(salt|status||||||udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key)
SALT="eCwWZ3Bj"
echo -n "${SALT}|success||||||||<orderId>|test@example.com|Test|Everlive Order ORD-xxx|999.00|EVL_1234567890_ABC123|gtKFFx" \
  | openssl dgst -sha512 | awk '{print $2}'
```

```bash
curl -X POST http://localhost:5000/api/v1/payments/payu/success \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "mihpayid=403993715534&status=success&txnid=EVL_1234567890_ABC123&amount=999.00&productinfo=Everlive+Order+ORD-xxx&firstname=Test&email=test%40example.com&udf1=<orderId>&hash=<computed_hash>"
```

**Expected:** 302 redirect to `http://localhost:5173/order-success?txnid=...&mihpayid=...&status=success&orderId=...`

**Check DB:** `orders` document: `orderStatus: "PAID"`, `payment.paymentStatus: "SUCCESS"`, `payment.payu_txnid` set.

---

## TEST 3 — PayU: Simulate Failure Callback

```bash
curl -X POST http://localhost:5000/api/v1/payments/payu/failure \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "txnid=EVL_1234567890_ABC123&status=failure&error_Message=Payment+declined"
```

**Expected:** 302 redirect to `http://localhost:5173/payment/failure?txnid=...&status=failure&reason=Payment+declined`

---

## TEST 4 — PayU: Verify Payment (optional client-side)

```bash
curl -X POST http://localhost:5000/api/v1/payments/payu/verify \
  -H "Content-Type: application/json" \
  -d '{
    "mihpayid": "403993715534",
    "status": "success",
    "txnid": "EVL_1234567890_ABC123",
    "amount": "999.00",
    "productinfo": "Everlive Order ORD-xxx",
    "firstname": "Test",
    "email": "test@example.com",
    "udf1": "<orderId>",
    "hash": "<computed_hash>"
  }'
```

**Expected 200:**
```json
{
  "success": true,
  "message": "Payment verified",
  "data": { "success": true, "txnid": "EVL_1234567890_ABC123", "mihpayid": "403993715534" }
}
```

---

## TEST 4b — PayU: Invalid / Tampered Hash

Verifies that a callback with a corrupted hash is rejected before any order update.

```bash
curl -X POST http://localhost:5000/api/v1/payments/payu/success \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "mihpayid=403993715534&status=success&txnid=EVL_1234567890_ABC123&amount=999.00&productinfo=Everlive+Order+ORD-xxx&firstname=Test&email=test%40example.com&udf1=<orderId>&hash=0000000000000000000000000000000000000000000000000000000000000000"
```

**Expected:** 302 redirect to `http://localhost:5173/payment/failure?reason=Hash+mismatch`

**Check server logs:** `[PayU] Hash mismatch for txnid=EVL_... mihpayid=... — possible response tampering`

**Check DB:** Order status must remain `PENDING_PAYMENT` — no update should have been applied.

---

## TEST 4c — PayU: Duplicate Callback (Idempotency)

Verifies that re-posting a valid success callback for an already-PAID order is a safe no-op.

1. Run TEST 2 first to get the order into `PAID` / `CONFIRMED` state.
2. POST the **same valid payload** again:

```bash
curl -X POST http://localhost:5000/api/v1/payments/payu/success \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "mihpayid=403993715534&status=success&txnid=EVL_1234567890_ABC123&amount=999.00&productinfo=Everlive+Order+ORD-xxx&firstname=Test&email=test%40example.com&udf1=<orderId>&hash=<same_hash>"
```

**Expected:** 302 redirect to `http://localhost:5173/order-success?...` (same as first call)

**Check server logs:** `[PayU] Duplicate callback ignored — order <orderId> already in CONFIRMED`

**Check DB:** Order status unchanged. Stock not double-reduced. No second Payment record created.

---

## TEST 5 — PayU: Refund (admin only)

Requires a PAID order and admin JWT token.

```bash
curl -X POST http://localhost:5000/api/v1/payments/refund/<orderId> \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin_token>" \
  -d '{"amount": 500, "reason": "Customer request"}'
```

**Expected 200:**
```json
{
  "success": true,
  "message": "Refund initiated.",
  "data": { "refundId": "rfnd_xxx", "amount": 500 }
}
```

**Note:** Requires `PAYU_MERCHANT_KEY` and `PAYU_MERCHANT_SALT` set. Uses PayU's cancel_refund_transaction API.

---

## TEST 6 — GoKwik: Create Order

Requires `GOKWIK_API_KEY`, `GOKWIK_API_SECRET`, and `GOKWIK_MERCHANT_ID` set, and `GOKWIK_ENV=sandbox`.

```bash
curl -X POST http://localhost:5000/api/v1/payments/gokwik/create-order \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <customer_token>" \
  -d '{
    "orderId": "<valid_order_id>",
    "phone": "9876543210",
    "email": "test@example.com",
    "name": "Test User",
    "address": {
      "line1": "123 Main Street",
      "city": "Mumbai",
      "state": "Maharashtra",
      "pincode": "400001"
    }
  }'
```

**Expected 200:**
```json
{
  "success": true,
  "message": "GoKwik order created.",
  "data": {
    "gokwikOrderId": "gkw_xxx",
    "checkoutToken": "...",
    "merchantOrderId": "ORD-xxx"
  }
}
```

---

## TEST 7 — GoKwik: Webhook (order.confirmed COD)

```bash
TIMESTAMP=$(date +%s)
BODY="{\"event_type\":\"order.confirmed\",\"merchant_order_id\":\"<orderNumber>\",\"payment_mode\":\"cod\"}"
SIG=$(echo -n "${TIMESTAMP}.${BODY}" | openssl dgst -sha256 -hmac "$GOKWIK_WEBHOOK_SECRET" | awk '{print $2}')

curl -X POST http://localhost:5000/api/v1/payments/webhook/gokwik \
  -H "Content-Type: application/json" \
  -H "x-gokwik-signature: $SIG" \
  -H "x-gokwik-timestamp: $TIMESTAMP" \
  -d "$BODY"
```

**Expected 200:**
```json
{ "received": true }
```

**Check DB:** Order status = `"CONFIRMED"`, Payment method = `"cod"`.

---

## TEST 8 — Payment Status

```bash
curl http://localhost:5000/api/v1/payments/status/<orderId> \
  -H "Authorization: Bearer <customer_token>"
```

**Expected 200:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "orderId": "...",
    "provider": "payu",
    "status": "paid",
    "amount": 99900,
    "currency": "INR",
    ...
  }
}
```

---

## Common Issues

| Issue | Fix |
|-------|-----|
| `PAYU_MERCHANT_KEY not set` | Add to `Backend/.env` (test key: gtKFFx) |
| `PAYU_MERCHANT_SALT not set` | Add to `Backend/.env` (test salt: eCwWZ3Bj) |
| `Payment record not found` | Order must go through /payu/success callback first |
| `Order is not in a payable state` | Order must be in PENDING_PAYMENT or CREATED status |
| `GoKwik 401 Unauthorized` | Verify GOKWIK_API_KEY and GOKWIK_API_SECRET |
| Webhook 400 on local | Use ngrok HTTPS URL in dashboard, not localhost |
