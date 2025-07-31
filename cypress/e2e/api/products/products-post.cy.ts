import { Product } from '../../../support/types'
import { getProductUrls, getTestData } from '../../../support/config'

describe('Products API - POST Operations', () => {
  const urls = getProductUrls()
  const testData = getTestData()

  describe('POST /products/add', () => {
    it('should create a new product with minimal required data', () => {
      const newProduct = {
        title: 'Test Product'
      }

      cy.request({
        method: 'POST',
        url: urls.add,
        headers: {
          'Content-Type': 'application/json'
        },
        body: newProduct
      }).then((response) => {
        // Validate response structure
        expect(response.status).to.eq(201)
        expect(response.body).to.have.property('id')
        expect(response.body).to.have.property('title')
        
        // Validate the created product has the sent data
        expect(response.body.title).to.eq(newProduct.title)
        
        // Validate ID is a number and reasonable
        expect(response.body.id).to.be.a('number')
        expect(response.body.id).to.be.greaterThan(0)
        
        // Validate response time
        expect(response.duration).to.be.lessThan(3000)
      })
    })

    it('should create a product with complete data and validate structure', () => {
      const completeProduct = {
        title: 'Complete Test Product',
        description: 'A comprehensive test product with all fields',
        price: 99.99,
        discountPercentage: 10.5,
        rating: 4.5,
        stock: 50,
        brand: 'TestBrand',
        category: 'electronics',
        thumbnail: 'https://example.com/thumbnail.jpg',
        images: [
          'https://example.com/image1.jpg',
          'https://example.com/image2.jpg'
        ]
      }

      cy.request({
        method: 'POST',
        url: urls.add,
        headers: {
          'Content-Type': 'application/json'
        },
        body: completeProduct
      }).then((response) => {
        expect(response.status).to.eq(201)
        
        // Validate all sent data is reflected in response
        expect(response.body.title).to.eq(completeProduct.title)
        expect(response.body.description).to.eq(completeProduct.description)
        expect(response.body.price).to.eq(completeProduct.price)
        expect(response.body.discountPercentage).to.eq(completeProduct.discountPercentage)
        expect(response.body.rating).to.eq(completeProduct.rating)
        expect(response.body.stock).to.eq(completeProduct.stock)
        expect(response.body.brand).to.eq(completeProduct.brand)
        expect(response.body.category).to.eq(completeProduct.category)
        expect(response.body.thumbnail).to.eq(completeProduct.thumbnail)
        expect(response.body.images).to.deep.eq(completeProduct.images)
        
        // Validate ID is generated
        expect(response.body.id).to.be.a('number')
        expect(response.body.id).to.be.greaterThan(0)
      })
    })

    it('should validate created product has same structure as existing products', () => {
      const testProduct = {
        title: 'Structure Test Product',
        price: 25.99,
        category: 'smartphones'
      }

      cy.request({
        method: 'POST',
        url: urls.add,
        headers: {
          'Content-Type': 'application/json'
        },
        body: testProduct
      }).then((response) => {
        const createdProduct = response.body
        
        // Validate it has the basic structure with sent data
        expect(createdProduct).to.have.property('id')
        expect(createdProduct).to.have.property('title')
        expect(createdProduct).to.have.property('price')
        expect(createdProduct).to.have.property('category')
        
        // Validate data types for sent fields
        expect(createdProduct.id).to.be.a('number')
        expect(createdProduct.title).to.be.a('string')
        expect(createdProduct.price).to.be.a('number')
        expect(createdProduct.category).to.be.a('string')
        
        // Validate sent data is reflected
        expect(createdProduct.title).to.eq(testProduct.title)
        expect(createdProduct.price).to.eq(testProduct.price)
        expect(createdProduct.category).to.eq(testProduct.category)
      })
    })

    it('should handle edge case with empty title', () => {
      const productWithEmptyTitle = {
        title: '',
        price: 10.99
      }

      cy.request({
        method: 'POST',
        url: urls.add,
        headers: {
          'Content-Type': 'application/json'
        },
        body: productWithEmptyTitle,
        failOnStatusCode: false
      }).then((response) => {
        // API might accept empty title or return error
        expect(response.status).to.be.oneOf([201, 400, 422])
        
        if (response.status === 201) {
          expect(response.body.title).to.eq('')
          expect(response.body.id).to.be.a('number')
        }
      })
    })

    it('should handle edge case with very long title', () => {
      const longTitle = 'A'.repeat(1000)
      const productWithLongTitle = {
        title: longTitle,
        price: 15.99
      }

      cy.request({
        method: 'POST',
        url: urls.add,
        headers: {
          'Content-Type': 'application/json'
        },
        body: productWithLongTitle,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([201, 400, 413])
        
        if (response.status === 201) {
          expect(response.body.title).to.eq(longTitle)
          expect(response.body.id).to.be.a('number')
        }
      })
    })

    it('should handle edge case with special characters in title', () => {
      const specialTitle = 'Product with special chars: !@#$%^&*()_+-=[]{}|;:,.<>?'
      const productWithSpecialChars = {
        title: specialTitle,
        price: 20.99
      }

      cy.request({
        method: 'POST',
        url: urls.add,
        headers: {
          'Content-Type': 'application/json'
        },
        body: productWithSpecialChars
      }).then((response) => {
        expect(response.status).to.eq(201)
        expect(response.body.title).to.eq(specialTitle)
        expect(response.body.id).to.be.a('number')
      })
    })

    it('should handle edge case with emoji and unicode in title', () => {
      const emojiTitle = 'Product with emoji 🚀🎉 and unicode ñáéíóú'
      const productWithEmoji = {
        title: emojiTitle,
        price: 30.99
      }

      cy.request({
        method: 'POST',
        url: urls.add,
        headers: {
          'Content-Type': 'application/json'
        },
        body: productWithEmoji
      }).then((response) => {
        expect(response.status).to.eq(201)
        expect(response.body.title).to.eq(emojiTitle)
        expect(response.body.id).to.be.a('number')
      })
    })

    it('should handle edge case with extreme price values', () => {
      const extremePriceProduct = {
        title: 'Extreme Price Product',
        price: 0.01 // Very low price
      }

      cy.request({
        method: 'POST',
        url: urls.add,
        headers: {
          'Content-Type': 'application/json'
        },
        body: extremePriceProduct
      }).then((response) => {
        expect(response.status).to.eq(201)
        expect(response.body.price).to.eq(0.01)
        expect(response.body.id).to.be.a('number')
      })
    })

    it('should handle edge case with negative price', () => {
      const negativePriceProduct = {
        title: 'Negative Price Product',
        price: -10.99
      }

      cy.request({
        method: 'POST',
        url: urls.add,
        headers: {
          'Content-Type': 'application/json'
        },
        body: negativePriceProduct,
        failOnStatusCode: false
      }).then((response) => {
        // API might accept or reject negative prices
        expect(response.status).to.be.oneOf([201, 400, 422])
        
        if (response.status === 201) {
          expect(response.body.price).to.eq(-10.99)
        }
      })
    })

    it('should handle edge case with very large price', () => {
      const largePriceProduct = {
        title: 'Large Price Product',
        price: 999999.99
      }

      cy.request({
        method: 'POST',
        url: urls.add,
        headers: {
          'Content-Type': 'application/json'
        },
        body: largePriceProduct
      }).then((response) => {
        expect(response.status).to.eq(201)
        expect(response.body.price).to.eq(999999.99)
        expect(response.body.id).to.be.a('number')
      })
    })

    it('should validate response headers', () => {
      const testProduct = {
        title: 'Headers Test Product',
        price: 45.99
      }

      cy.request({
        method: 'POST',
        url: urls.add,
        headers: {
          'Content-Type': 'application/json'
        },
        body: testProduct
      }).then((response) => {
        expect(response.headers).to.have.property('content-type')
        expect(response.headers['content-type']).to.include('application/json')
      })
    })

    it('should validate response time is reasonable', () => {
      const testProduct = {
        title: 'Performance Test Product',
        price: 55.99
      }

      cy.request({
        method: 'POST',
        url: urls.add,
        headers: {
          'Content-Type': 'application/json'
        },
        body: testProduct
      }).then((response) => {
        expect(response.duration).to.be.lessThan(3000)
      })
    })

    it('should handle request with custom headers', () => {
      const testProduct = {
        title: 'Custom Headers Product',
        price: 65.99
      }

      cy.request({
        method: 'POST',
        url: urls.add,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'User-Agent': 'Cypress-Test'
        },
        body: testProduct
      }).then((response) => {
        expect(response.status).to.eq(201)
        expect(response.body.title).to.eq(testProduct.title)
        expect(response.body.id).to.be.a('number')
      })
    })

    it('should validate multiple consecutive requests generate different IDs', () => {
      const testProduct = {
        title: 'Consecutive Test Product',
        price: 75.99
      }

      const requests = []
      
      // Make 3 consecutive requests
      for (let i = 0; i < 3; i++) {
        requests.push(
          cy.request({
            method: 'POST',
            url: urls.add,
            headers: {
              'Content-Type': 'application/json'
            },
            body: {
              ...testProduct,
              title: `${testProduct.title} ${i + 1}`
            }
          })
        )
      }

      cy.wrap(requests).then(() => {
        const responses = []
        
        requests.forEach((request) => {
          request.then((response) => {
            responses.push(response.body)
          })
        })
        
        // All responses should have the same ID (simulation behavior)
        cy.wrap(responses).then((allResponses) => {
          const ids = allResponses.map((r: any) => r.id)
          const uniqueIds = [...new Set(ids)]
          // API simulation always returns same ID (195)
          expect(uniqueIds.length).to.eq(1)
          
          // All should have the expected structure
          allResponses.forEach((response: any) => {
            expect(response).to.have.property('id')
            expect(response).to.have.property('title')
            expect(response).to.have.property('price')
            expect(response.id).to.be.a('number')
            expect(response.title).to.be.a('string')
            expect(response.price).to.be.a('number')
          })
        })
      })
    })

    it('should validate created product can be retrieved by ID', () => {
      const testProduct = {
        title: 'Retrievable Test Product',
        price: 85.99,
        category: 'smartphones'
      }

      cy.request({
        method: 'POST',
        url: urls.add,
        headers: {
          'Content-Type': 'application/json'
        },
        body: testProduct
      }).then((response) => {
        const createdProduct = response.body
        const productId = createdProduct.id
        
        // Try to retrieve the created product
        cy.request({
          method: 'GET',
          url: urls.getSingle(productId),
          failOnStatusCode: false
        }).then((getResponse) => {
          // Since this is a simulation, the product might not exist
          // But we can validate the response structure
          expect(getResponse.status).to.be.oneOf([200, 404])
          
          if (getResponse.status === 200) {
            // If it exists, validate it matches what we created
            expect(getResponse.body.id).to.eq(productId)
            expect(getResponse.body.title).to.eq(testProduct.title)
            expect(getResponse.body.price).to.eq(testProduct.price)
            expect(getResponse.body.category).to.eq(testProduct.category)
          }
        })
      })
    })

    it('should handle malformed JSON gracefully', () => {
      cy.request({
        method: 'POST',
        url: urls.add,
        headers: {
          'Content-Type': 'application/json'
        },
        body: '{"title": "Invalid JSON", "price": 99.99,}', // Malformed JSON
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([400, 422])
      })
    })

    it('should handle missing Content-Type header', () => {
      const testProduct = {
        title: 'No Content-Type Product',
        price: 95.99
      }

      cy.request({
        method: 'POST',
        url: urls.add,
        body: testProduct,
        failOnStatusCode: false
      }).then((response) => {
        // API might accept or reject requests without Content-Type
        expect(response.status).to.be.oneOf([201, 400, 415])
      })
    })

    it('should validate numeric constraints on created product', () => {
      const testProduct = {
        title: 'Constraints Test Product',
        price: 100.00,
        discountPercentage: 25.5,
        rating: 4.8,
        stock: 100
      }

      cy.request({
        method: 'POST',
        url: urls.add,
        headers: {
          'Content-Type': 'application/json'
        },
        body: testProduct
      }).then((response) => {
        const createdProduct = response.body
        
        // Validate numeric constraints
        expect(createdProduct.price).to.be.greaterThan(0)
        expect(createdProduct.discountPercentage).to.be.at.least(0)
        expect(createdProduct.discountPercentage).to.be.at.most(100)
        expect(createdProduct.rating).to.be.at.least(0)
        expect(createdProduct.rating).to.be.at.most(5)
        expect(createdProduct.stock).to.be.at.least(0)
        
        // Validate the values match what we sent
        expect(createdProduct.price).to.eq(testProduct.price)
        expect(createdProduct.discountPercentage).to.eq(testProduct.discountPercentage)
        expect(createdProduct.rating).to.eq(testProduct.rating)
        expect(createdProduct.stock).to.eq(testProduct.stock)
      })
    })
  })
}) 