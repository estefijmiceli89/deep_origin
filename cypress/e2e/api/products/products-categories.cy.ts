import { Category, Product } from '../../../support/types'
import { getProductUrls } from '../../../support/config'

describe('Products API - Categories Operations', () => {
  const urls = getProductUrls()

  describe('GET /products/categories', () => {
    it('should return all product categories with correct structure', () => {
      cy.request('GET', urls.categories).then((response) => {
        // Validate response status
        expect(response.status).to.eq(200)
        
        // Validate response body is an array
        expect(response.body).to.be.an('array')
        expect(response.body.length).to.be.greaterThan(0)
        
        // Validate each category has required fields
        response.body.forEach((category: Category) => {
          expect(category).to.have.property('slug')
          expect(category).to.have.property('name')
          expect(category).to.have.property('url')
          
          // Validate data types
          expect(category.slug).to.be.a('string')
          expect(category.name).to.be.a('string')
          expect(category.url).to.be.a('string')
          
          // Validate URL format
          expect(category.url).to.include('https://dummyjson.com/products/category/')
          expect(category.url).to.include(category.slug)
        })
      })
    })

    it('should validate categories have unique slugs', () => {
      cy.request('GET', urls.categories).then((response) => {
        const categories = response.body
        const slugs = categories.map((cat: Category) => cat.slug)
        const uniqueSlugs = [...new Set(slugs)]
        
        // All slugs should be unique
        expect(slugs.length).to.eq(uniqueSlugs.length)
      })
    })

    it('should validate categories have unique names', () => {
      cy.request('GET', urls.categories).then((response) => {
        const categories = response.body
        const names = categories.map((cat: Category) => cat.name)
        const uniqueNames = [...new Set(names)]
        
        // All names should be unique
        expect(names.length).to.eq(uniqueNames.length)
      })
    })

    it('should validate category URLs are accessible', () => {
      cy.request('GET', urls.categories).then((response) => {
        const categories = response.body
        
        // Test first few categories to ensure URLs are accessible
        const testCategories = categories.slice(0, 3)
        
        testCategories.forEach((category: Category) => {
          cy.request('GET', category.url).then((categoryResponse) => {
            expect(categoryResponse.status).to.eq(200)
            expect(categoryResponse.body).to.have.property('products')
            expect(categoryResponse.body.products).to.be.an('array')
          })
        })
      })
    })

    it('should validate specific known categories exist', () => {
      cy.request('GET', urls.categories).then((response) => {
        const categories = response.body
        const slugs = categories.map((cat: Category) => cat.slug)
        const names = categories.map((cat: Category) => cat.name)
        
        // Check for common categories
        expect(slugs).to.include('beauty')
        expect(slugs).to.include('furniture')
        expect(slugs).to.include('fragrances')
        
        expect(names).to.include('Beauty')
        expect(names).to.include('Furniture')
        expect(names).to.include('Fragrances')
      })
    })

    it('should validate category name and slug consistency', () => {
      cy.request('GET', urls.categories).then((response) => {
        const categories = response.body
        
        categories.forEach((category: Category) => {
          // Slug should contain only lowercase letters and hyphens
          expect(category.slug).to.match(/^[a-z-]+$/)
        })
      })
    })

    it('should validate response headers', () => {
      cy.request('GET', urls.categories).then((response) => {
        // Validate content type
        expect(response.headers['content-type']).to.include('application/json')
        
        // Validate CORS headers
        expect(response.headers['access-control-allow-origin']).to.eq('*')
      })
    })

    it('should handle request with custom headers', () => {
      cy.request({
        method: 'GET',
        url: urls.categories,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Cypress-Test'
        }
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.be.an('array')
        expect(response.body.length).to.be.greaterThan(0)
      })
    })

    it('should validate categories are sorted consistently', () => {
      cy.request('GET', urls.categories).then((response) => {
        const categories = response.body
        
        // Categories should be sorted alphabetically by name
        const names = categories.map((cat: Category) => cat.name)
        const sortedNames = [...names].sort()
        
        expect(names).to.deep.equal(sortedNames)
      })
    })

    it('should validate category count is reasonable', () => {
      cy.request('GET', urls.categories).then((response) => {
        const categories = response.body
        
        // Should have a reasonable number of categories (not too few, not too many)
        expect(categories.length).to.be.at.least(5)
        expect(categories.length).to.be.at.most(50)
      })
    })

    it('should validate category data integrity', () => {
      cy.request('GET', urls.categories).then((response) => {
        const categories = response.body
        
        categories.forEach((category: any) => {
          // No empty values
          expect(category.slug).to.not.be.empty
          expect(category.name).to.not.be.empty
          expect(category.url).to.not.be.empty
          
          // No null values
          expect(category.slug).to.not.be.null
          expect(category.name).to.not.be.null
          expect(category.url).to.not.be.null
          
          // No undefined values
          expect(category.slug).to.not.be.undefined
          expect(category.name).to.not.be.undefined
          expect(category.url).to.not.be.undefined
        })
      })
    })

    it('should validate response time is reasonable', () => {
      cy.request('GET', urls.categories).then((response) => {
        // Response should be fast (less than 2 seconds)
        expect(response.duration).to.be.lessThan(2000)
      })
    })

    it('should handle concurrent requests', () => {
      // Make multiple concurrent requests
      const requests = [
        cy.request('GET', urls.categories),
        cy.request('GET', urls.categories),
        cy.request('GET', urls.categories)
      ]
      
      cy.wrap(requests).then(() => {
        requests.forEach((request) => {
          request.then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body).to.be.an('array')
            expect(response.body.length).to.be.greaterThan(0)
          })
        })
      })
    })

    it('should validate categories against product data', () => {
      // First get categories
      cy.request('GET', urls.categories).then((categoriesResponse) => {
        const categories = categoriesResponse.body
        const categorySlugs = categories.map((cat: Category) => cat.slug)
        
        // Then get all products to verify categories match
        cy.request('GET', urls.getAll).then((productsResponse) => {
          const products = productsResponse.body.products
          const productCategories = [...new Set(products.map((p: Product) => p.category))]
          
          // All product categories should exist in categories list
          productCategories.forEach((productCategory) => {
            expect(categorySlugs).to.include(productCategory)
          })
        })
      })
    })

    // Edge Cases
    it('should handle request with query parameters gracefully', () => {
      cy.request('GET', `${urls.categories}?limit=10`).then((response) => {
        // API should ignore query parameters and return all categories
        expect(response.status).to.eq(200)
        expect(response.body).to.be.an('array')
        expect(response.body.length).to.be.greaterThan(0)
      })
    })

    it('should handle request with invalid query parameters', () => {
      cy.request('GET', `${urls.categories}?invalid=param`).then((response) => {
        // API should ignore invalid parameters and return all categories
        expect(response.status).to.eq(200)
        expect(response.body).to.be.an('array')
        expect(response.body.length).to.be.greaterThan(0)
      })
    })

    it('should handle request with empty query parameters', () => {
      cy.request('GET', `${urls.categories}?`).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.be.an('array')
        expect(response.body.length).to.be.greaterThan(0)
      })
    })

    it('should handle request with special characters in query parameters', () => {
      cy.request('GET', `${urls.categories}?param=test&param2=value`).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.be.an('array')
        expect(response.body.length).to.be.greaterThan(0)
      })
    })

    it('should handle request with very long query parameters', () => {
      const longParam = 'a'.repeat(1000)
      cy.request('GET', `${urls.categories}?param=${longParam}`).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.be.an('array')
        expect(response.body.length).to.be.greaterThan(0)
      })
    })

    it('should handle request with SQL injection attempt', () => {
      cy.request('GET', `${urls.categories}?param=1; DROP TABLE categories;--`).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.be.an('array')
        expect(response.body.length).to.be.greaterThan(0)
      })
    })

    it('should handle request with XSS attempt', () => {
      cy.request('GET', `${urls.categories}?param=<script>alert("xss")</script>`).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.be.an('array')
        expect(response.body.length).to.be.greaterThan(0)
      })
    })

    it('should handle request with emoji and unicode characters', () => {
      cy.request('GET', `${urls.categories}?param=🚀&param2=测试`).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.be.an('array')
        expect(response.body.length).to.be.greaterThan(0)
      })
    })

    it('should handle request with multiple spaces in query parameters', () => {
      cy.request('GET', `${urls.categories}?param=test%20value&param2=another%20%20value`).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.be.an('array')
        expect(response.body.length).to.be.greaterThan(0)
      })
    })

    it('should validate response structure consistency', () => {
      // Make multiple requests and compare structure
      const requests = [
        cy.request('GET', urls.categories),
        cy.request('GET', urls.categories),
        cy.request('GET', urls.categories)
      ]
      
      cy.wrap(requests).then(() => {
        requests.forEach((request) => {
          request.then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body).to.be.an('array')
            expect(response.body.length).to.be.greaterThan(0)
            
            // Validate first category structure
            if (response.body.length > 0) {
              const firstCategory = response.body[0]
              expect(firstCategory).to.have.property('slug')
              expect(firstCategory).to.have.property('name')
              expect(firstCategory).to.have.property('url')
            }
          })
        })
      })
    })


  })
}) 