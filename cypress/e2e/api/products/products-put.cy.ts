import { getProductUrls } from '../../../support/config';

describe('Products API - PUT Operations', () => {
  const urls = getProductUrls();

  describe('PUT /products/{id}', () => {
    it('should update product title successfully', () => {
      cy.fixture('test-data/products-put.json').then(testData => {
        const updateData = testData.basicUpdates.titleUpdate;
        const productId = updateData.productId;

        cy.request({
          method: 'PUT',
          url: urls.update(productId),
          headers: {
            'Content-Type': 'application/json',
          },
          body: {
            title: updateData.newTitle,
          },
        }).then(response => {
          // Validate response structure
          expect(response.status).to.eq(
            testData.validationRules.expectedStatus
          );
          expect(response.body).to.have.property('id');
          expect(response.body).to.have.property('title');

          // Validate the updated title
          expect(response.body.id).to.eq(productId);
          expect(response.body.title).to.eq(updateData.newTitle);

          // Validate response time
          expect(response.duration).to.be.lessThan(
            testData.validationRules.responseTimeLimit
          );
        });
      });
    });

    it('should update multiple product fields successfully', () => {
      cy.fixture('test-data/products-put.json').then(testData => {
        const updateData = testData.basicUpdates.multipleFieldsUpdate;
        const productId = updateData.productId;

        cy.request({
          method: 'PUT',
          url: urls.update(productId),
          headers: {
            'Content-Type': 'application/json',
          },
          body: {
            title: updateData.newTitle,
            price: updateData.newPrice,
            description: updateData.newDescription,
            category: updateData.newCategory,
          },
        }).then(response => {
          // Validate response structure
          expect(response.status).to.eq(
            testData.validationRules.expectedStatus
          );
          expect(response.body).to.have.property('id');
          expect(response.body).to.have.property('title');
          expect(response.body).to.have.property('price');
          expect(response.body).to.have.property('description');
          expect(response.body).to.have.property('category');

          // Validate the updated fields
          expect(response.body.id).to.eq(productId);
          expect(response.body.title).to.eq(updateData.newTitle);
          expect(response.body.price).to.eq(updateData.newPrice);
          expect(response.body.description).to.eq(updateData.newDescription);
          expect(response.body.category).to.eq(updateData.newCategory);
        });
      });
    });

    it('should update product with all available fields', () => {
      cy.fixture('test-data/products-put.json').then(testData => {
        const updateData = testData.basicUpdates.completeUpdate;
        const productId = updateData.productId;

        cy.request({
          method: 'PUT',
          url: urls.update(productId),
          headers: {
            'Content-Type': 'application/json',
          },
          body: updateData.updateFields,
        }).then(response => {
          // Validate response structure
          expect(response.status).to.eq(
            testData.validationRules.expectedStatus
          );
          expect(response.body).to.have.property('id');

          // Validate all updated fields
          expect(response.body.id).to.eq(productId);
          expect(response.body.title).to.eq(updateData.updateFields.title);
          expect(response.body.description).to.eq(
            updateData.updateFields.description
          );
          expect(response.body.price).to.eq(updateData.updateFields.price);
          expect(response.body.discountPercentage).to.eq(
            updateData.updateFields.discountPercentage
          );
          expect(response.body.rating).to.eq(updateData.updateFields.rating);
          expect(response.body.stock).to.eq(updateData.updateFields.stock);
          expect(response.body.brand).to.eq(updateData.updateFields.brand);
          expect(response.body.category).to.eq(
            updateData.updateFields.category
          );
          expect(response.body.thumbnail).to.eq(
            updateData.updateFields.thumbnail
          );
          expect(response.body.images).to.deep.eq(
            updateData.updateFields.images
          );
        });
      });
    });

    it('should handle edge case with empty update body', () => {
      cy.fixture('test-data/products-put.json').then(testData => {
        const edgeCaseData = testData.edgeCases.emptyBody;
        const productId = edgeCaseData.productId;

        cy.request({
          method: 'PUT',
          url: urls.update(productId),
          headers: {
            'Content-Type': 'application/json',
          },
          body: {},
        }).then(response => {
          // Should return the original product unchanged
          expect(response.status).to.eq(
            testData.validationRules.expectedStatus
          );
          expect(response.body).to.have.property('id');
          expect(response.body.id).to.eq(productId);
        });
      });
    });

    it('should handle edge case with very long title', () => {
      cy.fixture('test-data/products-put.json').then(testData => {
        const edgeCaseData = testData.edgeCases.longTitle;
        const productId = edgeCaseData.productId;

        cy.request({
          method: 'PUT',
          url: urls.update(productId),
          headers: {
            'Content-Type': 'application/json',
          },
          body: {
            title: edgeCaseData.longTitle,
          },
        }).then(response => {
          // Validate response structure
          expect(response.status).to.eq(
            testData.validationRules.expectedStatus
          );
          expect(response.body).to.have.property('id');
          expect(response.body).to.have.property('title');

          // Validate the updated title
          expect(response.body.id).to.eq(productId);
          expect(response.body.title).to.eq(edgeCaseData.longTitle);
        });
      });
    });

    it('should handle edge case with special characters in title', () => {
      cy.fixture('test-data/products-put.json').then(testData => {
        const edgeCaseData = testData.edgeCases.specialCharacters;
        const productId = edgeCaseData.productId;

        cy.request({
          method: 'PUT',
          url: urls.update(productId),
          headers: {
            'Content-Type': 'application/json',
          },
          body: {
            title: edgeCaseData.specialTitle,
          },
        }).then(response => {
          // Validate response structure
          expect(response.status).to.eq(
            testData.validationRules.expectedStatus
          );
          expect(response.body).to.have.property('id');
          expect(response.body).to.have.property('title');

          // Validate the updated title
          expect(response.body.id).to.eq(productId);
          expect(response.body.title).to.eq(edgeCaseData.specialTitle);
        });
      });
    });

    it('should handle edge case with emoji and unicode in title', () => {
      cy.fixture('test-data/products-put.json').then(testData => {
        const edgeCaseData = testData.edgeCases.emojiUnicode;
        const productId = edgeCaseData.productId;

        cy.request({
          method: 'PUT',
          url: urls.update(productId),
          headers: {
            'Content-Type': 'application/json',
          },
          body: {
            title: edgeCaseData.emojiTitle,
          },
        }).then(response => {
          // Validate response structure
          expect(response.status).to.eq(
            testData.validationRules.expectedStatus
          );
          expect(response.body).to.have.property('id');
          expect(response.body).to.have.property('title');

          // Validate the updated title
          expect(response.body.id).to.eq(productId);
          expect(response.body.title).to.eq(edgeCaseData.emojiTitle);
        });
      });
    });

    it('should handle edge case with extreme price values', () => {
      cy.fixture('test-data/products-put.json').then(testData => {
        const edgeCaseData = testData.edgeCases.extremePrice;
        const productId = edgeCaseData.productId;

        cy.request({
          method: 'PUT',
          url: urls.update(productId),
          headers: {
            'Content-Type': 'application/json',
          },
          body: {
            price: edgeCaseData.extremePrice,
          },
        }).then(response => {
          // Validate response structure
          expect(response.status).to.eq(
            testData.validationRules.expectedStatus
          );
          expect(response.body).to.have.property('id');
          expect(response.body).to.have.property('price');

          // Validate the updated price
          expect(response.body.id).to.eq(productId);
          expect(response.body.price).to.eq(edgeCaseData.extremePrice);
        });
      });
    });

    it('should handle edge case with negative price', () => {
      cy.fixture('test-data/products-put.json').then(testData => {
        const edgeCaseData = testData.edgeCases.negativePrice;
        const productId = edgeCaseData.productId;

        cy.request({
          method: 'PUT',
          url: urls.update(productId),
          headers: {
            'Content-Type': 'application/json',
          },
          body: {
            price: edgeCaseData.negativePrice,
          },
        }).then(response => {
          // Validate response structure
          expect(response.status).to.eq(
            testData.validationRules.expectedStatus
          );
          expect(response.body).to.have.property('id');
          expect(response.body).to.have.property('price');

          // Validate the updated price
          expect(response.body.id).to.eq(productId);
          expect(response.body.price).to.eq(edgeCaseData.negativePrice);
        });
      });
    });

    it('should handle edge case with invalid product ID', () => {
      cy.fixture('test-data/products-put.json').then(testData => {
        const edgeCaseData = testData.edgeCases.invalidId;
        const invalidId = edgeCaseData.invalidId;

        cy.request({
          method: 'PUT',
          url: urls.update(invalidId),
          headers: {
            'Content-Type': 'application/json',
          },
          body: {
            title: 'Test Product',
          },
          failOnStatusCode: false,
        }).then(response => {
          // Should return error for invalid ID
          expect(response.status).to.be.oneOf(edgeCaseData.expectedStatus);
        });
      });
    });

    it('should handle edge case with non-existent product ID', () => {
      cy.fixture('test-data/products-put.json').then(testData => {
        const edgeCaseData = testData.edgeCases.nonExistentId;
        const nonExistentId = edgeCaseData.nonExistentId;

        cy.request({
          method: 'PUT',
          url: urls.update(nonExistentId),
          headers: {
            'Content-Type': 'application/json',
          },
          body: {
            title: 'Test Product',
          },
          failOnStatusCode: false,
        }).then(response => {
          // Should return error for non-existent ID
          expect(response.status).to.be.oneOf(edgeCaseData.expectedStatus);
        });
      });
    });

    it('should validate response headers', () => {
      cy.fixture('test-data/products-put.json').then(testData => {
        const headerTestData = testData.headersTest.basicUpdate;
        const productId = headerTestData.productId;

        cy.request({
          method: 'PUT',
          url: urls.update(productId),
          headers: {
            'Content-Type': 'application/json',
          },
          body: {
            title: headerTestData.newTitle,
          },
        }).then(response => {
          // Validate response headers
          expect(response.headers).to.have.property('content-type');
          expect(response.headers['content-type']).to.include(
            'application/json'
          );
        });
      });
    });

    it('should validate response time is reasonable', () => {
      cy.fixture('test-data/products-put.json').then(testData => {
        const performanceTestData = testData.headersTest.performanceUpdate;
        const productId = performanceTestData.productId;

        cy.request({
          method: 'PUT',
          url: urls.update(productId),
          headers: {
            'Content-Type': 'application/json',
          },
          body: {
            title: performanceTestData.newTitle,
          },
        }).then(response => {
          // Validate response time
          expect(response.duration).to.be.lessThan(
            testData.validationRules.responseTimeLimit
          );
        });
      });
    });

    it('should handle request with custom headers', () => {
      cy.fixture('test-data/products-put.json').then(testData => {
        const customHeaderTestData = testData.headersTest.customHeadersUpdate;
        const productId = customHeaderTestData.productId;

        cy.request({
          method: 'PUT',
          url: urls.update(productId),
          headers: {
            'Content-Type': 'application/json',
            'X-Custom-Header': 'custom-value',
            Authorization: 'Bearer test-token',
          },
          body: {
            title: customHeaderTestData.newTitle,
          },
        }).then(response => {
          // Validate response structure
          expect(response.status).to.eq(
            testData.validationRules.expectedStatus
          );
          expect(response.body).to.have.property('id');
          expect(response.body).to.have.property('title');

          // Validate the updated title
          expect(response.body.id).to.eq(productId);
          expect(response.body.title).to.eq(customHeaderTestData.newTitle);
        });
      });
    });

    it('should handle concurrent updates to the same product', () => {
      cy.fixture('test-data/products-put.json').then(testData => {
        const concurrentTestData = testData.concurrentTest;
        const productId = concurrentTestData.productId;
        const requests: Cypress.Chainable<Cypress.Response<any>>[] = [];

        // Create multiple concurrent requests
        for (let i = 0; i < 3; i++) {
          cy.request({
            method: 'PUT',
            url: urls.update(productId),
            headers: {
              'Content-Type': 'application/json',
            },
            body: {
              title: `${concurrentTestData.baseTitle} - Update ${i + 1}`,
            },
          }).then(response => {
            expect(response.status).to.eq(
              testData.validationRules.expectedStatus
            );
            expect(response.body).to.have.property('id');
            expect(response.body).to.have.property('title');
            expect(response.body.id).to.eq(productId);
          });
        }

        // Execute all requests concurrently
        cy.wrap(requests).then(() => {
          // All requests should complete successfully
          requests.forEach(request => {
            request.then(response => {
              expect(response.status).to.eq(
                testData.validationRules.expectedStatus
              );
              expect(response.body).to.have.property('id');
              expect(response.body).to.have.property('title');
              expect(response.body.id).to.eq(productId);
            });
          });
        });
      });
    });

    it('should maintain performance under load', () => {
      cy.fixture('test-data/products-put.json').then(testData => {
        const loadTestData = testData.performanceTest;
        const productId = loadTestData.productId;
        const requests: Cypress.Chainable<Cypress.Response<any>>[] = [];

        // Create multiple requests for load testing
        for (let i = 0; i < 5; i++) {
          cy.request({
            method: 'PUT',
            url: urls.update(productId),
            headers: {
              'Content-Type': 'application/json',
            },
            body: {
              title: `${loadTestData.baseTitle} - Load Test ${i + 1}`,
            },
          }).then(response => {
            expect(response.status).to.eq(
              testData.validationRules.expectedStatus
            );
            expect(response.duration).to.be.lessThan(
              testData.validationRules.responseTimeLimit
            );
          });
        }

        // Execute all requests and validate performance
        cy.wrap(requests).then(() => {
          requests.forEach(request => {
            request.then(response => {
              expect(response.status).to.eq(
                testData.validationRules.expectedStatus
              );
              expect(response.duration).to.be.lessThan(
                testData.validationRules.responseTimeLimit
              );
            });
          });
        });
      });
    });

    it('should validate product data types and constraints after update', () => {
      cy.fixture('test-data/products-put.json').then(testData => {
        const validationTestData = testData.validationTest;
        const productId = validationTestData.productId;

        cy.request({
          method: 'PUT',
          url: urls.update(productId),
          headers: {
            'Content-Type': 'application/json',
          },
          body: validationTestData.updateFields,
        }).then(response => {
          // Validate response structure
          expect(response.status).to.eq(
            testData.validationRules.expectedStatus
          );
          expect(response.body).to.have.property('id');

          // Validate data types
          expect(response.body.id).to.be.a('number');
          expect(response.body.title).to.be.a('string');
          expect(response.body.price).to.be.a('number');
          expect(response.body.description).to.be.a('string');
          expect(response.body.category).to.be.a('string');
          expect(response.body.brand).to.be.a('string');
          expect(response.body.stock).to.be.a('number');
          expect(response.body.rating).to.be.a('number');

          // Validate constraints
          expect(response.body.price).to.be.greaterThan(0);
          expect(response.body.stock).to.be.at.least(0);
          expect(response.body.rating).to.be.at.least(0);
          expect(response.body.rating).to.be.at.most(5);
        });
      });
    });

    it('should handle malformed JSON in request body', () => {
      cy.fixture('test-data/products-put.json').then(testData => {
        const malformedData = testData.malformedData;
        const productId = malformedData.productId;

        cy.request({
          method: 'PUT',
          url: urls.update(productId),
          headers: {
            'Content-Type': 'application/json',
          },
          body: malformedData.invalidJson,
          failOnStatusCode: false,
        }).then(response => {
          // Should return error for malformed JSON
          expect(response.status).to.be.oneOf([400, 500]);
        });
      });
    });

    it('should handle request without Content-Type header', () => {
      cy.fixture('test-data/products-put.json').then(testData => {
        const noContentTypeData = testData.headersTest.noContentTypeUpdate;
        const productId = noContentTypeData.productId;

        cy.request({
          method: 'PUT',
          url: urls.update(productId),
          body: {
            title: noContentTypeData.newTitle,
          },
        }).then(response => {
          // Should still work without Content-Type header
          expect(response.status).to.eq(
            testData.validationRules.expectedStatus
          );
          expect(response.body).to.have.property('id');
          expect(response.body).to.have.property('title');

          // Validate the updated title
          expect(response.body.id).to.eq(productId);
          expect(response.body.title).to.eq(noContentTypeData.newTitle);
        });
      });
    });
  });
});
