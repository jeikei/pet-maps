import { uniq, reject, find, sortBy } from 'lodash';
import {
    FETCH_SHELTERS,
    ADD_SHELTER_TO_ACTIVE,
    REMOVE_SHELTER_FROM_ACTIVE,
    RESET_ACTIVE_SHELTERS,
    TOGGLE_SHELTERS_ACTIVE,
    RECEIVE_SHELTERS
} from '../actions/shelterActions';

export default (state = {
    loading: false,
    items: [],
    activeShelterIds: []
}, action) => {
    switch (action.type) {
        case FETCH_SHELTERS:
            return {
                ...state,
                loading: true
            }
        case ADD_SHELTER_TO_ACTIVE: {
            return {
                ...state,
                activeShelterIds: uniq([...state.activeShelterIds, action.payload])
            };
        }
        case REMOVE_SHELTER_FROM_ACTIVE: {
            const activeShelterIds = reject(state.activeShelterIds, (shelterId) => {
                return shelterId === action.payload;
            });
            return {
                ...state,
                activeShelterIds
            };
        }
        case RESET_ACTIVE_SHELTERS: {
            if (action.payload) {
                return {
                    ...state,
                    activeShelterIds: state.items.map((shelter) => {
                        return shelter.id.$t;
                    })
                };
            } else {
                return {
                    ...state,
                    activeShelterIds: []
                };
            }
        }
        case TOGGLE_SHELTERS_ACTIVE: {
            const sheltersActive = [];
            const shelterIdsInactive = [];
            const shelterIds = action.payload;
            let activeShelterIds = state.activeShelterIds;

            shelterIds.forEach(shelterId => {
                const activeShelter = find(activeShelterIds, activeShelter => {
                    return activeShelter === shelterId;
                });
                if (activeShelter) {
                    shelterIdsInactive.push(shelterId);
                } else {
                    sheltersActive.push(shelterId);
                }
            })

            if (shelterIdsInactive.length) {
                activeShelterIds = reject(activeShelterIds, activeShelter => {
                    return shelterIdsInactive.indexOf(activeShelter) > -1;
                });
            }

            return {
                ...state,
                activeShelterIds: [].concat(activeShelterIds, sheltersActive)
            }
        }
        case RECEIVE_SHELTERS: {
            return {
                ...state,
                items: sortBy(action.payload, ['markerId']).reverse(),
                activeShelterIds: action.payload.map((shelter) => {
                    return shelter.id.$t;
                }),
                loading: false
            }
        }
        default:
            return state;
    }
}