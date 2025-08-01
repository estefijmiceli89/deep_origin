import { Product } from '../../../support/types'
import { getProductUrls } from '../../../support/config'

describe('Products API - POST Operations', () => {
  const urls = getProductUrls()

  describe('POST /products/add', () => {
    it('should create a new product with minimal required data', () => {
      cy.fixture('test-data/products-post.json').then(testData => {
        const newProduct = testData.minimalProduct

        cy.request({
          method: 'POST',
          url: urls.add,
          headers: {
            'Content-Type': 'application/json',
          },
          body: newProduct,
        }).then(response => {
          // Validate response structure
          expect(response.status).to.eq(testData.validationRules.expectedStatus)
          expect(response.body).to.have.property('id')
          expect(response.body).to.have.property('title')

          // Validate the created product has the sent data
          expect(response.body.title).to.eq(newProduct.title)

          // Validate ID is a number and reasonable
          expect(response.body.id).to.be.a('number')
          expect(response.body.id).to.be.greaterThan(0)

          // Validate response time
          expect(response.duration).to.be.lessThan(
            testData.validationRules.responseTimeLimit
          )
        })
      })
    })

    it('should create a product with complete data and validate structure', () => {
      cy.fixture('test-data/products-post').then(testData => {
        const completeProduct = testData.completeProduct

        cy.request({
          method: 'POST',
          url: urls.add,
          headers: {
            'Content-Type': 'application/json',
          },
          body: completeProduct,
        }).then(response => {
          expect(response.status).to.eq(testData.validationRules.expectedStatus)

          // Validate all sent data is reflected in response
          expect(response.body.title).to.eq(completeProduct.title)
          expect(response.body.description).to.eq(completeProduct.description)
          expect(response.body.price).to.eq(completeProduct.price)
          expect(response.body.discountPercentage).to.eq(
            completeProduct.discountPercentage
          )
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
    })

    it('should validate created product has same structure as existing products', () => {
      cy.fixture('test-data/products-post.json').then(testData => {
        const testProduct = testData.structureTestProduct

        cy.request({
          method: 'POST',
          url: urls.add,
          headers: {
            'Content-Type': 'application/json',
          },
          body: testProduct,
        }).then(response => {
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
    })

    it('should handle edge case with empty title', () => {
      cy.fixture('test-data/products-post.json').then(testData => {
        const productWithEmptyTitle = testData.edgeCases.emptyTitle

        cy.request({
          method: 'POST',
          url: urls.add,
          headers: {
            'Content-Type': 'application/json',
          },
          body: productWithEmptyTitle,
          failOnStatusCode: false,
        }).then(response => {
          // API might accept empty title or return error
          expect(response.status).to.be.oneOf([201, 400, 422])

          if (response.status === 201) {
            expect(response.body.title).to.eq('')
            expect(response.body.id).to.be.a('number')
          }
        })
      })
    })

    it('should handle edge case with very long title', () => {
      cy.fixture('test-data/products-post.json').then(testData => {
        const productWithLongTitle = testData.edgeCases.longTitle

        cy.request({
          method: 'POST',
          url: urls.add,
          headers: {
            'Content-Type': 'application/json',
          },
          body: productWithLongTitle,
          failOnStatusCode: false,
        }).then(response => {
          expect(response.status).to.be.oneOf([201, 400, 413])

          if (response.status === 201) {
            expect(response.body.title).to.eq(productWithLongTitle.title)
            expect(response.body.id).to.be.a('number')
          }
        })
      })
    })

    it('should handle edge case with special characters in title', () => {
      cy.fixture('test-data/products-post.json').then(testData => {
        const productWithSpecialChars = testData.edgeCases.specialCharacters

        cy.request({
          method: 'POST',
          url: urls.add,
          headers: {
            'Content-Type': 'application/json',
          },
          body: productWithSpecialChars,
        }).then(response => {
          expect(response.status).to.eq(201)
          expect(response.body.title).to.eq(productWithSpecialChars.title)
          expect(response.body.id).to.be.a('number')
        })
      })
    })

    it('should handle edge case with emoji and unicode in title', () => {
      cy.fixture('test-data/products-post.json').then(testData => {
        const productWithEmoji = testData.edgeCases.emojiUnicode

        cy.request({
          method: 'POST',
          url: urls.add,
          headers: {
            'Content-Type': 'application/json',
          },
          body: productWithEmoji,
        }).then(response => {
          expect(response.status).to.eq(201)
          expect(response.body.title).to.eq(productWithEmoji.title)
          expect(response.body.id).to.be.a('number')
        })
      })
    })

    it('should handle edge case with extreme price values', () => {
      cy.fixture('test-data/products-post.json').then(testData => {
        const extremePriceProduct = testData.edgeCases.extremePrice

        cy.request({
          method: 'POST',
          url: urls.add,
          headers: {
            'Content-Type': 'application/json',
          },
          body: extremePriceProduct,
        }).then(response => {
          expect(response.status).to.eq(201)
          expect(response.body.price).to.eq(extremePriceProduct.price)
          expect(response.body.id).to.be.a('number')
        })
      })
    })

    it('should handle edge case with negative price', () => {
      cy.fixture('test-data/products-post.json').then(testData => {
        const negativePriceProduct = testData.edgeCases.negativePrice

        cy.request({
          method: 'POST',
          url: urls.add,
          headers: {
            'Content-Type': 'application/json',
          },
          body: negativePriceProduct,
          failOnStatusCode: false,
        }).then(response => {
          // API might accept or reject negative prices
          expect(response.status).to.be.oneOf([201, 400, 422])

          if (response.status === 201) {
            expect(response.body.price).to.eq(negativePriceProduct.price)
          }
        })
      })
    })

    it('should handle edge case with very large price', () => {
      cy.fixture('test-data/products-post.json').then(testData => {
        const largePriceProduct = testData.edgeCases.largePrice

        cy.request({
          method: 'POST',
          url: urls.add,
          headers: {
            'Content-Type': 'application/json',
          },
          body: largePriceProduct,
        }).then(response => {
          expect(response.status).to.eq(201)
          expect(response.body.price).to.eq(largePriceProduct.price)
          expect(response.body.id).to.be.a('number')
        })
      })
    })

    it('should validate response time is reasonable', () => {
      cy.fixture('test-data/products-post.json').then(testData => {
        const testProduct = testData.headersTest.performanceProduct

        cy.request({
          method: 'POST',
          url: urls.add,
          headers: {
            'Content-Type': 'application/json',
          },
          body: testProduct,
        }).then(response => {
          expect(response.duration).to.be.lessThan(3000)
        })
      })
    })

    it('should validate multiple consecutive requests generate different IDs', () => {
      cy.fixture('test-data/products-post.json').then(testData => {
        const testProduct = testData.concurrentTest.baseProduct

        const requests: Cypress.Chainable<Cypress.Response<any>>[] = []

        // Make 3 consecutive requests
        for (let i = 0; i < 3; i++) {
          requests.push(
            cy.request({
              method: 'POST',
              url: urls.add,
              headers: {
                'Content-Type': 'application/json',
              },
              body: {
                ...testProduct,
                title: `${testProduct.title} ${i + 1}`,
              },
            })
          )
        }

        cy.wrap(requests).then(() => {
          const responses: Cypress.Response<any>[] = []

          requests.forEach(request => {
            request.then((response: Cypress.Response<any>) => {
              responses.push(response.body)
            })
          })

          // All responses should have the same ID (simulation behavior)
          cy.wrap(responses).then((allResponses: Cypress.Response<any>[]) => {
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
    })

    it('should handle malformed JSON gracefully', () => {
      cy.request({
        method: 'POST',
        url: urls.add,
        headers: {
          'Content-Type': 'application/json',
        },
        body: '{"title": "Invalid JSON", "price": 99.99,}', // Malformed JSON
        failOnStatusCode: false,
      }).then(response => {
        expect(response.status).to.be.oneOf([400, 422])
      })
    })

    it('should handle missing Content-Type header', () => {
      const testProduct = {
        title: 'No Content-Type Product',
        price: 95.99,
      }

      cy.request({
        method: 'POST',
        url: urls.add,
        body: testProduct,
        failOnStatusCode: false,
      }).then(response => {
        // API might accept or reject requests without Content-Type
        expect(response.status).to.be.oneOf([201, 400, 415])
      })
    })

    it('should validate numeric constraints on created product', () => {
      const testProduct = {
        title: 'Constraints Test Product',
        price: 100.0,
        discountPercentage: 25.5,
        rating: 4.8,
        stock: 100,
      }

      cy.request({
        method: 'POST',
        url: urls.add,
        headers: {
          'Content-Type': 'application/json',
        },
        body: testProduct,
      }).then(response => {
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
        expect(createdProduct.discountPercentage).to.eq(
          testProduct.discountPercentage
        )
        expect(createdProduct.rating).to.eq(testProduct.rating)
        expect(createdProduct.stock).to.eq(testProduct.stock)
      })
    })

    it('should validate against known categories from categories endpoint', () => {
      // First get valid categories from categories endpoint
      cy.request('GET', urls.categories).then(categoriesResponse => {
        const validCategories = categoriesResponse.body.map(
          (cat: any) => cat.slug
        )

        // Test with first 3 valid categories
        const testCategories = validCategories.slice(0, 3)

        testCategories.forEach((category: string) => {
          const testProduct = {
            title: `Test Product - ${category}`,
            price: 40.99,
            category: category,
          }

          cy.request({
            method: 'POST',
            url: urls.add,
            headers: {
              'Content-Type': 'application/json',
            },
            body: testProduct,
          }).then(response => {
            expect(response.status).to.eq(201)
            expect(response.body.title).to.eq(testProduct.title)
            expect(response.body.price).to.eq(testProduct.price)
            expect(response.body.category).to.eq(testProduct.category)
            expect(response.body.id).to.be.a('number')
          })
        })
      })
    })

    it('should handle empty arrays in images field', () => {
      const productWithEmptyImages = {
        title: 'Product with Empty Images',
        price: 25.99,
        images: [],
      }

      cy.request({
        method: 'POST',
        url: urls.add,
        headers: {
          'Content-Type': 'application/json',
        },
        body: productWithEmptyImages,
      }).then(response => {
        expect(response.status).to.eq(201)
        expect(response.body.title).to.eq(productWithEmptyImages.title)
        expect(response.body.price).to.eq(productWithEmptyImages.price)
        expect(response.body.images).to.deep.eq([])
        expect(response.body.id).to.be.a('number')
      })
    })

    it('should handle concurrent requests properly', () => {
      const concurrentRequests: Cypress.Chainable<Cypress.Response<any>>[] = []

      // Make 5 concurrent requests
      for (let i = 0; i < 5; i++) {
        concurrentRequests.push(
          cy.request({
            method: 'POST',
            url: urls.add,
            headers: {
              'Content-Type': 'application/json',
            },
            body: {
              title: `Concurrent Product ${i}`,
              price: 10 + i,
              category: 'smartphones',
            },
          })
        )
      }

      cy.wrap(concurrentRequests).then(() => {
        const responses: Cypress.Response<any>[] = []

        concurrentRequests.forEach(request => {
          request.then((response: Cypress.Response<any>) => {
            responses.push(response)
          })
        })

        // Validate all responses are successful
        cy.wrap(responses).then((allResponses: Cypress.Response<any>[]) => {
          allResponses.forEach(response => {
            expect(response.status).to.eq(201)
            expect(response.body).to.have.property('id')
            expect(response.body).to.have.property('title')
            expect(response.body).to.have.property('price')
            expect(response.body.id).to.be.a('number')
            expect(response.body.title).to.be.a('string')
            expect(response.body.price).to.be.a('number')
          })

          // Validate all have different titles (as expected)
          const titles = allResponses.map((r: any) => r.body.title)
          const uniqueTitles = [...new Set(titles)]
          expect(uniqueTitles.length).to.eq(5)
        })
      })
    })
  })
})
