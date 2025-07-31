// API Configuration - Centralized configuration for all API endpoints
export const API_CONFIG = {
  // Environment-based base URLs
  baseUrl: {
    development: 'https://dummyjson.com',
    staging: 'https://dummyjson.com', // Same for now, can be different
    production: 'https://dummyjson.com'
  },
  
  // API Endpoints
  endpoints: {
    products: {
      getAll: '/products',
      getSingle: (id: number | string) => `/products/${id}`,
      search: '/products/search',
      categories: '/products/categories',
      categoryList: '/products/category-list',
      category: (category: string) => `/products/category/${category}`,
      add: '/products/add',
      update: (id: number | string) => `/products/${id}`,
      delete: (id: number | string) => `/products/${id}`
    }
  },
  
  // Timeouts
  timeouts: {
    request: 10000,
    response: 3000,
    navigation: 30000
  },
  
  // Test data
  testData: {
    validProductIds: [1, 2, 3, 10, 11, 16, 20, 25],
    invalidProductIds: [-1, 0, 9999, 99999],
    searchQueries: ['phone', 'beauty', 'furniture', 'electronics', 'laptop'],
    categories: ['beauty', 'furniture', 'groceries', 'electronics', 'smartphones'],
    pagination: {
      limits: [1, 5, 10, 20, 30, 50],
      skips: [0, 5, 10, 20, 50, 100]
    }
  }
}

// Get current environment (default to development)
export const getCurrentEnvironment = (): string => {
  return Cypress.env('ENV') || 'development'
}

// Get base URL for current environment
export const getBaseUrl = (): string => {
  const env = getCurrentEnvironment()
  return API_CONFIG.baseUrl[env as keyof typeof API_CONFIG.baseUrl] || API_CONFIG.baseUrl.development
}

// Get full URL for an endpoint
export const getApiUrl = (endpoint: string): string => {
  return `${getBaseUrl()}${endpoint}`
}

// Get product endpoint URLs
export const getProductUrls = () => {
  const baseUrl = getBaseUrl()
  return {
    getAll: `${baseUrl}${API_CONFIG.endpoints.products.getAll}`,
    getSingle: (id: number | string) => `${baseUrl}${API_CONFIG.endpoints.products.getSingle(id)}`,
    search: `${baseUrl}${API_CONFIG.endpoints.products.search}`,
    categories: `${baseUrl}${API_CONFIG.endpoints.products.categories}`,
    categoryList: `${baseUrl}${API_CONFIG.endpoints.products.categoryList}`,
    category: (category: string) => `${baseUrl}${API_CONFIG.endpoints.products.category(category)}`,
    add: `${baseUrl}${API_CONFIG.endpoints.products.add}`,
    update: (id: number | string) => `${baseUrl}${API_CONFIG.endpoints.products.update(id)}`,
    delete: (id: number | string) => `${baseUrl}${API_CONFIG.endpoints.products.delete(id)}`
  }
}

// Get timeouts
export const getTimeouts = () => {
  return {
    request: Cypress.env('REQUEST_TIMEOUT') || API_CONFIG.timeouts.request,
    response: Cypress.env('RESPONSE_TIMEOUT') || API_CONFIG.timeouts.response,
    navigation: Cypress.env('NAVIGATION_TIMEOUT') || API_CONFIG.timeouts.navigation
  }
}

// Get test data
export const getTestData = () => {
  return API_CONFIG.testData
} 