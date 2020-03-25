import {API_URL} from "../common/contants";

export const searchQuery = (database, query) => {
    return fetch(`${API_URL}/search/db/${database}?${query}`,
                 {
                     credentials: 'include'
                 })
        .then(response => response.json())
};

export const searchPage = (database, page) => {
    return fetch(`${API_URL}/search/db/${database}/pg/${page}`,
                 {
                     credentials: 'include'
                 })
        .then(response => response.json())
};