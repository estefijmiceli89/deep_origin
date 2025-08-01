import { getProductUrls } from '../../../support/config'

describe('Products API - DELETE Operations', () => {
  const urls = getProductUrls()

  describe('DELETE /products/{id}', () => {
    it('should delete product successfully and return deleted product data', () => {
      cy.fixture('test-data/products-delete.json').then(testData => {
        const deleteData = testData.basicDeletion.validProduct
        const productId = deleteData.productId

        cy.request({
          method: 'DELETE',
          url: urls.delete(productId),
        }).then(response => {
          // Validate response structure
          expect(response.status).to.eq(testData.validationRules.expectedStatus)
          expect(response.body).to.have.property('id')
          expect(response.body).to.have.property('title')
          expect(response.body).to.have.property('isDeleted')
          expect(response.body).to.have.property('deletedOn')

          // Validate the deleted product data
          expect(response.body.id).to.eq(productId)
          expect(response.body.isDeleted).to.be.true
          expect(response.body.deletedOn).to.be.a('string')

          // Validate deletedOn is a valid ISO date
          expect(new Date(response.body.deletedOn)).to.be.instanceOf(Date)
          expect(new Date(response.body.deletedOn).getTime()).to.not.be.NaN

          // Validate response time
          expect(response.duration).to.be.lessThan(
            testData.validationRules.responseTimeLimit
          )
        })
      })
    })

    it('should delete product and validate all product fields are present', () => {
      cy.fixture('test-data/products-delete.json').then(testData => {
        const deleteData = testData.basicDeletion.completeProduct
        const productId = deleteData.productId

        cy.request({
          method: 'DELETE',
          url: urls.delete(productId),
        }).then(response => {
          // Validate response structure
          expect(response.status).to.eq(testData.validationRules.expectedStatus)
          expect(response.body).to.have.property('id')
          expect(response.body).to.have.property('title')
          expect(response.body).to.have.property('description')
          expect(response.body).to.have.property('price')
          expect(response.body).to.have.property('category')
          expect(response.body).to.have.property('brand')
          expect(response.body).to.have.property('stock')
          expect(response.body).to.have.property('rating')
          expect(response.body).to.have.property('isDeleted')
          expect(response.body).to.have.property('deletedOn')

          // Validate the deleted product data
          expect(response.body.id).to.eq(productId)
          expect(response.body.isDeleted).to.be.true
          expect(response.body.deletedOn).to.be.a('string')

          // Validate data types
          expect(response.body.id).to.be.a('number')
          expect(response.body.title).to.be.a('string')
          expect(response.body.description).to.be.a('string')
          expect(response.body.price).to.be.a('number')
          expect(response.body.category).to.be.a('string')
          expect(response.body.brand).to.be.a('string')
          expect(response.body.stock).to.be.a('number')
          expect(response.body.rating).to.be.a('number')
        })
      })
    })

    it('should handle edge case with invalid product ID', () => {
      cy.fixture('test-data/products-delete.json').then(testData => {
        const edgeCaseData = testData.edgeCases.invalidId
        const invalidId = edgeCaseData.invalidId

        cy.request({
          method: 'DELETE',
          url: urls.delete(invalidId),
          failOnStatusCode: false,
        }).then(response => {
          // Should return error for invalid ID
          expect(response.status).to.be.oneOf(edgeCaseData.expectedStatus)
        })
      })
    })

    it('should handle edge case with non-existent product ID', () => {
      cy.fixture('test-data/products-delete.json').then(testData => {
        const edgeCaseData = testData.edgeCases.nonExistentId
        const nonExistentId = edgeCaseData.nonExistentId

        cy.request({
          method: 'DELETE',
          url: urls.delete(nonExistentId),
          failOnStatusCode: false,
        }).then(response => {
          // Should return error for non-existent ID
          expect(response.status).to.be.oneOf(edgeCaseData.expectedStatus)
        })
      })
    })

    it('should validate response time is reasonable', () => {
      cy.fixture('test-data/products-delete.json').then(testData => {
        const performanceTestData = testData.headersTest.performanceDelete
        const productId = performanceTestData.productId

        cy.request({
          method: 'DELETE',
          url: urls.delete(productId),
        }).then(response => {
          // Validate response time
          expect(response.duration).to.be.lessThan(
            testData.validationRules.responseTimeLimit
          )
        })
      })
    })

    it('should validate deleted product data types and constraints', () => {
      cy.fixture('test-data/products-delete.json').then(testData => {
        const validationTestData = testData.validationTest
        const productId = validationTestData.productId

        cy.request({
          method: 'DELETE',
          url: urls.delete(productId),
        }).then(response => {
          // Validate response structure
          expect(response.status).to.eq(testData.validationRules.expectedStatus)
          expect(response.body).to.have.property('id')
          expect(response.body).to.have.property('isDeleted')
          expect(response.body).to.have.property('deletedOn')

          // Validate data types
          expect(response.body.id).to.be.a('number')
          expect(response.body.title).to.be.a('string')
          expect(response.body.price).to.be.a('number')
          expect(response.body.description).to.be.a('string')
          expect(response.body.category).to.be.a('string')
          expect(response.body.brand).to.be.a('string')
          expect(response.body.stock).to.be.a('number')
          expect(response.body.rating).to.be.a('number')
          expect(response.body.isDeleted).to.be.a('boolean')
          expect(response.body.deletedOn).to.be.a('string')

          // Validate constraints
          expect(response.body.price).to.be.greaterThan(0)
          expect(response.body.stock).to.be.at.least(0)
          expect(response.body.rating).to.be.at.least(0)
          expect(response.body.rating).to.be.at.most(5)
          expect(response.body.isDeleted).to.be.true

          // Validate deletedOn is a valid ISO date
          const deletedOnDate = new Date(response.body.deletedOn)
          expect(deletedOnDate).to.be.instanceOf(Date)
          expect(deletedOnDate.getTime()).to.not.be.NaN
        })
      })
    })

    it('should validate that deletedOn timestamp is recent', () => {
      cy.fixture('test-data/products-delete.json').then(testData => {
        const timestampTestData = testData.timestampTest
        const productId = timestampTestData.productId

        const beforeDelete = new Date()

        cy.request({
          method: 'DELETE',
          url: urls.delete(productId),
        }).then(response => {
          const afterDelete = new Date()

          // Validate response structure
          expect(response.status).to.eq(testData.validationRules.expectedStatus)
          expect(response.body).to.have.property('deletedOn')

          // Parse the deletedOn timestamp
          const deletedOn = new Date(response.body.deletedOn)

          // Validate that deletedOn is between beforeDelete and afterDelete
          expect(deletedOn.getTime()).to.be.at.least(beforeDelete.getTime())
          expect(deletedOn.getTime()).to.be.at.most(
            afterDelete.getTime() + 1000
          ) // Allow 1 second tolerance
        })
      })
    })

    it('should handle multiple deletions of the same product', () => {
      cy.fixture('test-data/products-delete.json').then(testData => {
        const multipleDeleteData = testData.multipleDeleteTest
        const productId = multipleDeleteData.productId

        // First deletion
        cy.request({
          method: 'DELETE',
          url: urls.delete(productId),
        }).then(firstResponse => {
          expect(firstResponse.status).to.eq(
            testData.validationRules.expectedStatus
          )
          expect(firstResponse.body.isDeleted).to.be.true

          // Second deletion of the same product
          cy.request({
            method: 'DELETE',
            url: urls.delete(productId),
          }).then(secondResponse => {
            expect(secondResponse.status).to.eq(
              testData.validationRules.expectedStatus
            )
            expect(secondResponse.body.isDeleted).to.be.true

            // Both should return the same product data
            expect(firstResponse.body.id).to.eq(secondResponse.body.id)
            expect(firstResponse.body.title).to.eq(secondResponse.body.title)
          })
        })
      })
    })

    it('should validate that deleted product maintains original data structure', () => {
      cy.fixture('test-data/products-delete.json').then(testData => {
        const structureTestData = testData.structureTest
        const productId = structureTestData.productId

        cy.request({
          method: 'DELETE',
          url: urls.delete(productId),
        }).then(response => {
          // Validate response structure
          expect(response.status).to.eq(testData.validationRules.expectedStatus)

          // Validate that all original product fields are present
          expect(response.body).to.have.property('id')
          expect(response.body).to.have.property('title')
          expect(response.body).to.have.property('description')
          expect(response.body).to.have.property('price')
          expect(response.body).to.have.property('discountPercentage')
          expect(response.body).to.have.property('rating')
          expect(response.body).to.have.property('stock')
          expect(response.body).to.have.property('category')
          expect(response.body).to.have.property('thumbnail')
          expect(response.body).to.have.property('images')
          expect(response.body).to.have.property('brand')

          // Validate that deletion-specific fields are present
          expect(response.body).to.have.property('isDeleted')
          expect(response.body).to.have.property('deletedOn')

          // Validate the product ID
          expect(response.body.id).to.eq(productId)
          expect(response.body.isDeleted).to.be.true
        })
      })
    })
  })
})
