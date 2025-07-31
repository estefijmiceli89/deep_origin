import { Category } from '../../../support/types'
import { getProductUrls } from '../../../support/config'

describe('Products API - Category List Operations', () => {
  const urls = getProductUrls()

  describe('GET /products/category-list', () => {
    it('should return category list with correct structure', () => {
      cy.request('GET', urls.categoryList).then((response) => {
        // Validate response structure
        expect(response.status).to.eq(200)
        expect(response.body).to.be.an('array')
        expect(response.body.length).to.be.greaterThan(0)
        
        // Validate all items are strings
        response.body.forEach((category: string) => {
          expect(category).to.be.a('string')
          expect(category.length).to.be.greaterThan(0)
        })
      })
    })

    it('should validate all categories are unique', () => {
      cy.request('GET', urls.categoryList).then((response) => {
        const categories = response.body
        const uniqueCategories = [...new Set(categories)]
        
        expect(uniqueCategories.length).to.eq(categories.length)
      })
    })

    it('should validate categories are in slug format', () => {
      cy.request('GET', urls.categoryList).then((response) => {
        const categories = response.body
        
        // Validate slug format (lowercase, hyphens instead of spaces)
        categories.forEach((category: string) => {
          expect(category).to.match(/^[a-z0-9-]+$/)
          expect(category).to.not.include(' ')
          expect(category).to.not.include('_')
        })
      })
    })

    it('should validate specific known categories exist', () => {
      const expectedCategories = [
        'beauty',
        'fragrances', 
        'furniture',
        'groceries',
        'home-decoration',
        'laptops',
        'smartphones',
        'womens-dresses',
        'mens-shirts'
      ]

      cy.request('GET', urls.categoryList).then((response) => {
        const categories = response.body
        
        expectedCategories.forEach((expectedCategory) => {
          expect(categories).to.include(expectedCategory)
        })
      })
    })

    it('should validate category count is reasonable', () => {
      cy.request('GET', urls.categoryList).then((response) => {
        const categories = response.body
        
        // Should have a reasonable number of categories (not too few, not too many)
        expect(categories.length).to.be.at.least(10)
        expect(categories.length).to.be.at.most(50)
      })
    })

    it('should validate response headers', () => {
      cy.request('GET', urls.categoryList).then((response) => {
        expect(response.headers).to.have.property('content-type')
        expect(response.headers['content-type']).to.include('application/json')
      })
    })

    it('should validate response time is reasonable', () => {
      cy.request('GET', urls.categoryList).then((response) => {
        expect(response.duration).to.be.lessThan(3000)
      })
    })

    it('should validate categories against detailed categories endpoint', () => {
      // Get category list
      cy.request('GET', urls.categoryList).then((categoryListResponse) => {
        const categoryList = categoryListResponse.body
        
        // Get detailed categories
        cy.request('GET', urls.categories).then((detailedCategoriesResponse) => {
          const detailedCategories = detailedCategoriesResponse.body
          
          // Validate both endpoints return the same number of categories
          expect(categoryList.length).to.eq(detailedCategories.length)
          
          // Validate all category list items exist in detailed categories
          categoryList.forEach((categorySlug: string) => {
            const matchingDetailedCategory = detailedCategories.find(
              (cat: Category) => cat.slug === categorySlug
            )
            expect(matchingDetailedCategory).to.exist
          })
        })
      })
    })

    it('should handle request with query parameters gracefully', () => {
      cy.request({
        method: 'GET',
        url: `${urls.categoryList}?param=value`,
        failOnStatusCode: false
      }).then((response) => {
        // Should still return 200 even with query parameters
        expect(response.status).to.eq(200)
        expect(response.body).to.be.an('array')
      })
    })

    it('should validate categories are sorted consistently', () => {
      cy.request('GET', urls.categoryList).then((response) => {
        const categories = response.body
        
        // Categories should be sorted alphabetically
        const sortedCategories = [...categories].sort()
        expect(categories).to.deep.equal(sortedCategories)
      })
    })

    it('should validate no empty or null categories', () => {
      cy.request('GET', urls.categoryList).then((response) => {
        const categories = response.body
        
        categories.forEach((category: string) => {
          expect(category).to.not.be.empty
          expect(category).to.not.be.null
          expect(category).to.not.be.undefined
        })
      })
    })

    it('should validate categories contain only valid characters', () => {
      cy.request('GET', urls.categoryList).then((response) => {
        const categories = response.body
        
        categories.forEach((category: string) => {
          // Should only contain lowercase letters, numbers, and hyphens
          expect(category).to.match(/^[a-z0-9-]+$/)
          // Should not start or end with hyphen
          expect(category).to.not.match(/^-|-$/)
          // Should not have consecutive hyphens
          expect(category).to.not.include('--')
        })
      })
    })

    // Additional Edge Cases and Security Tests
    it('should handle request with custom headers', () => {
      cy.request({
        method: 'GET',
        url: urls.categoryList,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Cypress-Test'
        }
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.be.an('array')
      })
    })

    it('should handle request with invalid query parameters', () => {
      cy.request({
        method: 'GET',
        url: `${urls.categoryList}?invalid=param`,
        failOnStatusCode: false
      }).then((response) => {
        // Should still return 200 even with invalid parameters
        expect(response.status).to.eq(200)
        expect(response.body).to.be.an('array')
      })
    })

    it('should handle request with empty query parameters', () => {
      cy.request({
        method: 'GET',
        url: `${urls.categoryList}?`,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.be.an('array')
      })
    })

    it('should handle request with special characters in query parameters', () => {
      cy.request({
        method: 'GET',
        url: `${urls.categoryList}?param=!@#$%^&*()`,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.be.an('array')
      })
    })

    it('should handle request with very long query parameters', () => {
      const longParam = 'a'.repeat(1000)
      cy.request({
        method: 'GET',
        url: `${urls.categoryList}?param=${longParam}`,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.be.an('array')
      })
    })

    it('should handle request with SQL injection attempt', () => {
      cy.request({
        method: 'GET',
        url: `${urls.categoryList}?param=1' OR '1'='1`,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.be.an('array')
      })
    })

    it('should handle request with XSS attempt', () => {
      cy.request({
        method: 'GET',
        url: `${urls.categoryList}?param=<script>alert('xss')</script>`,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.be.an('array')
      })
    })

    it('should handle request with emoji and unicode characters', () => {
      cy.request({
        method: 'GET',
        url: `${urls.categoryList}?param=🚀🎉🌟`,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.be.an('array')
      })
    })

    it('should handle request with multiple spaces in query parameters', () => {
      cy.request({
        method: 'GET',
        url: `${urls.categoryList}?param=multiple%20spaces`,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.be.an('array')
      })
    })

    it('should validate response structure consistency', () => {
      const requests: Cypress.Chainable<Cypress.Response<any>>[] = []
      
      // Make multiple requests to ensure consistency
      for (let i = 0; i < 3; i++) {
        requests.push(
          cy.request('GET', urls.categoryList)
        )
      }
      
      cy.wrap(requests).then(() => {
        const responses: string[][] = []
        
        requests.forEach((request) => {
          request.then((response: Cypress.Response<any>) => {
            responses.push(response.body)
          })
        })
        
        // All responses should have the same structure and length
        cy.wrap(responses).then((allResponses: string[][]) => {
          const firstResponse = allResponses[0]
          const firstLength = firstResponse.length
          
          allResponses.forEach((response: string[]) => {
            expect(response).to.be.an('array')
            expect(response.length).to.eq(firstLength)
          })
        })
      })
    })

    it('should validate categories have consistent naming pattern', () => {
      cy.request('GET', urls.categoryList).then((response) => {
        const categories = response.body
        
        categories.forEach((category: string) => {
          // Should not contain uppercase letters
          expect(category).to.not.match(/[A-Z]/)
          // Should not contain special characters except hyphens
          expect(category).to.not.match(/[^a-z0-9-]/)
          // Should be at least 3 characters long
          expect(category.length).to.be.at.least(3)
        })
      })
    })

    it('should validate categories are properly formatted slugs', () => {
      cy.request('GET', urls.categoryList).then((response) => {
        const categories = response.body
        
        categories.forEach((category: string) => {
          // Should not have leading or trailing hyphens
          expect(category).to.not.match(/^-|-$/)
          // Should not have consecutive hyphens
          expect(category).to.not.include('--')
          // Should not have spaces
          expect(category).to.not.include(' ')
          // Should not have underscores
          expect(category).to.not.include('_')
        })
      })
    })
  })
}) 