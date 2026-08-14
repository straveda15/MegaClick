/**
 * Generic State Machine Guard
 */

const MACHINES = {
    LEAD: {
        NEW: ["CONTACTED", "FOLLOW_UP", "DROPPED"],
        CONTACTED: ["FOLLOW_UP", "CONVERTED", "DROPPED"],
        FOLLOW_UP: ["FOLLOW_UP", "CONVERTED", "DROPPED"],
        CONVERTED: [], // Terminal
        DROPPED: ["NEW"], // Allow revival
    },
    ORDER: {
         PENDING: ["CONFIRMED"],
         CONFIRMED: ["PACKAGING"], // Packaging is a bridge to existing shipment system
         PACKAGING: ["SHIPPED"],
         SHIPPED: ["DELIVERED"],
         DELIVERED: [], // Terminal
    },
    RETURN: {
         REQUESTED: ["VERIFIED"],
         VERIFIED: ["APPROVED"],
         APPROVED: ["PICKUP_INITIATED"],
         PICKUP_INITIATED: ["COMPLETED"],
         COMPLETED: [], // Terminal
    }
};

export const canTransition = (entityType, currentState, nextState) => {
    const machine = MACHINES[entityType.toUpperCase()];
    if (!machine) {
        throw new Error(`State machine for entity type ${entityType} not defined`);
    }

    if (!machine[currentState]) {
        throw new Error(`Unknown current state: ${currentState} for entity ${entityType}`);
    }

    return machine[currentState].includes(nextState);
};

export const validateTransition = (entityType, currentState, nextState) => {
    if (!canTransition(entityType, currentState, nextState)) {
        throw new Error(`Invalid state transition for ${entityType}: Cannot move from ${currentState} to ${nextState}.`);
    }
    return true;
};
