/**
 * Indian states and union territories with the cities/districts we actually see
 * clients from, so the Add Lead form can offer a city dropdown that narrows to
 * whichever state was picked.
 *
 * Maharashtra is listed at district level (it's the default and where most
 * clients are); the rest carry their major cities. Anything missing can still
 * be typed in — the city control falls back to free text.
 */

export const DEFAULT_STATE = 'Maharashtra';

export const STATE_CITIES: Record<string, string[]> = {
  'Maharashtra': [
    'Mumbai', 'Mumbai Suburban', 'Thane', 'Palghar', 'Raigad', 'Navi Mumbai',
    'Pune', 'Pimpri-Chinchwad', 'Satara', 'Sangli', 'Solapur', 'Kolhapur',
    'Nashik', 'Ahmednagar', 'Dhule', 'Nandurbar', 'Jalgaon',
    'Aurangabad', 'Jalna', 'Beed', 'Latur', 'Osmanabad', 'Nanded', 'Parbhani', 'Hingoli',
    'Nagpur', 'Wardha', 'Bhandara', 'Gondia', 'Chandrapur', 'Gadchiroli',
    'Amravati', 'Akola', 'Washim', 'Buldhana', 'Yavatmal', 'Ratnagiri', 'Sindhudurg',
  ],
  'Andhra Pradesh': [
    'Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool', 'Rajahmundry',
    'Tirupati', 'Kakinada', 'Anantapur', 'Kadapa', 'Eluru', 'Ongole', 'Chittoor', 'Srikakulam',
  ],
  'Arunachal Pradesh': ['Itanagar', 'Naharlagun', 'Pasighat', 'Tawang', 'Ziro', 'Bomdila'],
  'Assam': [
    'Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Nagaon', 'Tinsukia',
    'Tezpur', 'Bongaigaon', 'Dhubri', 'Sivasagar',
  ],
  'Bihar': [
    'Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Darbhanga', 'Purnia',
    'Bihar Sharif', 'Arrah', 'Begusarai', 'Katihar', 'Chapra', 'Munger',
  ],
  'Chhattisgarh': [
    'Raipur', 'Bhilai', 'Bilaspur', 'Korba', 'Durg', 'Rajnandgaon', 'Raigarh', 'Jagdalpur', 'Ambikapur',
  ],
  'Goa': ['Panaji', 'Margao', 'Vasco da Gama', 'Mapusa', 'Ponda', 'Bicholim'],
  'Gujarat': [
    'Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar',
    'Gandhinagar', 'Junagadh', 'Anand', 'Bharuch', 'Navsari', 'Mehsana', 'Valsad', 'Morbi',
  ],
  'Haryana': [
    'Gurugram', 'Faridabad', 'Panipat', 'Ambala', 'Karnal', 'Hisar',
    'Rohtak', 'Sonipat', 'Yamunanagar', 'Panchkula', 'Bhiwani', 'Sirsa',
  ],
  'Himachal Pradesh': ['Shimla', 'Dharamshala', 'Solan', 'Mandi', 'Kullu', 'Baddi', 'Una', 'Bilaspur'],
  'Jharkhand': ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Deoghar', 'Hazaribagh', 'Giridih', 'Ramgarh'],
  'Karnataka': [
    'Bengaluru', 'Mysuru', 'Hubballi', 'Dharwad', 'Mangaluru', 'Belagavi',
    'Kalaburagi', 'Davanagere', 'Ballari', 'Shivamogga', 'Tumakuru', 'Udupi', 'Hassan', 'Bidar',
  ],
  'Kerala': [
    'Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam', 'Alappuzha',
    'Palakkad', 'Kannur', 'Kottayam', 'Malappuram', 'Pathanamthitta', 'Idukki',
  ],
  'Madhya Pradesh': [
    'Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Ujjain', 'Sagar',
    'Dewas', 'Satna', 'Ratlam', 'Rewa', 'Katni', 'Singrauli',
  ],
  'Manipur': ['Imphal', 'Thoubal', 'Bishnupur', 'Churachandpur', 'Kakching'],
  'Meghalaya': ['Shillong', 'Tura', 'Jowai', 'Nongstoin', 'Baghmara'],
  'Mizoram': ['Aizawl', 'Lunglei', 'Champhai', 'Serchhip', 'Kolasib'],
  'Nagaland': ['Kohima', 'Dimapur', 'Mokokchung', 'Tuensang', 'Wokha'],
  'Odisha': [
    'Bhubaneswar', 'Cuttack', 'Rourkela', 'Berhampur', 'Sambalpur',
    'Puri', 'Balasore', 'Bhadrak', 'Baripada', 'Jharsuguda',
  ],
  'Punjab': [
    'Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Mohali',
    'Hoshiarpur', 'Pathankot', 'Moga', 'Firozpur',
  ],
  'Rajasthan': [
    'Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer', 'Bikaner',
    'Alwar', 'Bhilwara', 'Sikar', 'Bharatpur', 'Pali', 'Sri Ganganagar',
  ],
  'Sikkim': ['Gangtok', 'Namchi', 'Gyalshing', 'Mangan', 'Rangpo'],
  'Tamil Nadu': [
    'Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli',
    'Tiruppur', 'Erode', 'Vellore', 'Thoothukudi', 'Thanjavur', 'Dindigul', 'Kanchipuram', 'Hosur',
  ],
  'Telangana': [
    'Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam',
    'Ramagundam', 'Mahbubnagar', 'Secunderabad', 'Nalgonda', 'Siddipet',
  ],
  'Tripura': ['Agartala', 'Udaipur', 'Dharmanagar', 'Kailashahar', 'Belonia'],
  'Uttar Pradesh': [
    'Lucknow', 'Kanpur', 'Ghaziabad', 'Noida', 'Agra', 'Varanasi',
    'Meerut', 'Prayagraj', 'Bareilly', 'Aligarh', 'Moradabad', 'Gorakhpur',
    'Saharanpur', 'Jhansi', 'Mathura', 'Ayodhya',
  ],
  'Uttarakhand': ['Dehradun', 'Haridwar', 'Roorkee', 'Haldwani', 'Rudrapur', 'Kashipur', 'Rishikesh', 'Nainital'],
  'West Bengal': [
    'Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri', 'Bardhaman',
    'Malda', 'Kharagpur', 'Haldia', 'Darjeeling', 'Barasat', 'Krishnanagar',
  ],

  // ── Union territories ──────────────────────────────────────────────────────
  'Andaman and Nicobar Islands': ['Port Blair', 'Mayabunder', 'Rangat', 'Diglipur', 'Car Nicobar'],
  'Chandigarh': ['Chandigarh'],
  'Dadra and Nagar Haveli and Daman and Diu': ['Silvassa', 'Daman', 'Diu'],
  'Delhi': [
    'New Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi',
    'Central Delhi', 'Dwarka', 'Rohini', 'Shahdara', 'Najafgarh',
  ],
  'Jammu and Kashmir': ['Srinagar', 'Jammu', 'Anantnag', 'Baramulla', 'Udhampur', 'Kathua', 'Sopore'],
  'Ladakh': ['Leh', 'Kargil'],
  'Lakshadweep': ['Kavaratti', 'Agatti', 'Amini', 'Andrott', 'Minicoy'],
  'Puducherry': ['Puducherry', 'Karaikal', 'Mahe', 'Yanam'],
};

/** States and UTs, alphabetical — the order the dropdown renders in. */
export const INDIAN_STATES = Object.keys(STATE_CITIES).sort((a, b) => a.localeCompare(b));

/** Cities for a state, alphabetical. Unknown states resolve to an empty list. */
export const citiesForState = (state?: string): string[] =>
  [...(STATE_CITIES[state ?? ''] ?? [])].sort((a, b) => a.localeCompare(b));
