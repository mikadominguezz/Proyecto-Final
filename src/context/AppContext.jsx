import React, { createContext, useContext, useReducer } from "react";
import {
  MOCK_USERS,
  INITIAL_SERVICES,
  INITIAL_QUOTES,
  INITIAL_SUPPLIES,
  INITIAL_SUPPLY_OFFERS,
} from "../data/mockData.js";

const initialState = {
  currentUser: null,
  users: MOCK_USERS,
  services: INITIAL_SERVICES,
  quotes: INITIAL_QUOTES,
  supplies: INITIAL_SUPPLIES,
  supplyOffers: INITIAL_SUPPLY_OFFERS,
};

function appReducer(state, action) {
  switch (action.type) {
    case "LOGIN":
      return { ...state, currentUser: action.payload };
    
    case "LOGOUT":
      return { ...state, currentUser: null };
    
    case "ADD_SERVICE":
      return { ...state, services: [...state.services, action.payload] };
    
    case "UPDATE_SERVICE":
      return {
        ...state,
        services: state.services.map((s) =>
          s.id === action.payload.id ? action.payload : s
        ),
      };
    
    case "ADD_QUOTE":
      return { ...state, quotes: [...state.quotes, action.payload] };
    
    case "UPDATE_QUOTE":
      return {
        ...state,
        quotes: state.quotes.map((q) =>
          q.id === action.payload.id ? action.payload : q
        ),
      };
    
    case "DELETE_QUOTE":
      return {
        ...state,
        quotes: state.quotes.filter((q) => q.id !== action.payload),
      };
    
    case "ADD_SUPPLY":
      return { ...state, supplies: [...state.supplies, action.payload] };
    
    case "UPDATE_SUPPLY":
      return {
        ...state,
        supplies: state.supplies.map((s) =>
          s.id === action.payload.id ? action.payload : s
        ),
      };
    
    case "DELETE_SUPPLY":
      return {
        ...state,
        supplies: state.supplies.filter((s) => s.id !== action.payload),
      };
    
    case "ADD_SUPPLY_OFFER":
      return {
        ...state,
        supplyOffers: [...state.supplyOffers, action.payload],
      };
    
    case "SELECT_QUOTE":
      return {
        ...state,
        services: state.services.map((s) =>
          s.id === action.payload.serviceId
            ? {
                ...s,
                estado: "ASIGNADO",
                cotizacionSeleccionadaId: action.payload.quoteId,
              }
            : s
        ),
      };
    
    case "RATE_PROVIDER":
      return {
        ...state,
        services: state.services.map((s) =>
          s.id === action.payload.serviceId
            ? { ...s, providerRating: action.payload.rating }
            : s
        ),
        users: state.users.map((u) => {
          if (u.id === action.payload.providerId) {
            // Obtener rating actual y total de calificaciones
            const currentRating = u.rating || 0;
            const currentRatingCount = u.ratingCount || 0;
            
            // Calcular el nuevo rating como promedio ponderado
            // (rating_actual * cantidad_actual + nueva_calificacion) / (cantidad_actual + 1)
            const totalPoints = (currentRating * currentRatingCount) + action.payload.rating;
            const newRatingCount = currentRatingCount + 1;
            const newRating = totalPoints / newRatingCount;
            
            return { 
              ...u, 
              rating: Math.round(newRating * 10) / 10, // Redondear a 1 decimal
              ratingCount: newRatingCount 
            };
          }
          return u;
        }),
      };
    
    default:
      return state;
  }
}

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp debe usarse dentro de AppProvider");
  }
  return context;
}
