import { Product } from '../../../support/types';
import { getProductUrls } from '../../../support/config';

describe('Products API - Category Products Operations', () => {
  const urls = getProductUrls();

  describe('GET /products/category/{category}', () => {
    it('should return products for a specific category with correct structure', () => {
      cy.fixture('test-data/products-category.json').then(testData => {
        const category = testData.validCategories.smartphones.name;

        cy.request('GET', urls.category(category)).then(response => {
          // Validate response structure using fixture data
          expect(response.status).to.eq(200);
          testData.structureValidation.responseFields.forEach(
            (field: string) => {
              expect(response.body).to.have.property(field);
            }
          );

          // Validate products array
          expect(response.body.products).to.be.an('array');
          expect(response.body.products.length).to.be.greaterThan(0);

          // Validate all products belong to the requested category
          response.body.products.forEach((product: Product) => {
            expect(product.category).to.eq(category);
          });
        });
      });
    });

    it('should validate products structure for smartphones category', () => {
      cy.fixture('test-data/products-category.json').then(testData => {
        cy.request(
          'GET',
          urls.category(testData.validCategories.smartphones.name)
        ).then(response => {
          const products = response.body.products;

          // Validate first product structure
          if (products.length > 0) {
            const firstProduct = products[0];

            // Validate required fields using fixture data
            testData.validationRules.requiredFields.forEach((field: string) => {
              expect(firstProduct).to.have.property(field);
            });

            // Validate data types using fixture data
            Object.entries(testData.validationRules.dataTypes).forEach(
              ([field, expectedType]) => {
                if (expectedType === 'number') {
                  expect(firstProduct[field]).to.be.a('number');
                } else if (expectedType === 'string') {
                  expect(firstProduct[field]).to.be.a('string');
                } else if (expectedType === 'array') {
                  expect(firstProduct[field]).to.be.an('array');
                }
              }
            );

            // Validate constraints using fixture data
            expect(firstProduct.price).to.be.greaterThan(
              testData.validationRules.constraints.price.min
            );
            expect(firstProduct.stock).to.be.at.least(
              testData.validationRules.constraints.stock.min
            );
            expect(firstProduct.rating).to.be.at.least(
              testData.validationRules.constraints.rating.min
            );
            expect(firstProduct.rating).to.be.at.most(
              testData.validationRules.constraints.rating.max
            );
          }
        });
      });
    });

    it('should return products for beauty category', () => {
      cy.fixture('test-data/products-category.json').then(testData => {
        const category = testData.validCategories.beauty.name;

        cy.request('GET', urls.category(category)).then(response => {
          expect(response.status).to.eq(200);
          expect(response.body.products).to.be.an('array');
          expect(response.body.products.length).to.be.greaterThan(0);

          // Validate all products are beauty category
          response.body.products.forEach((product: Product) => {
            expect(product.category).to.eq(category);
          });
        });
      });
    });

    it('should return products for furniture category', () => {
      cy.fixture('test-data/products-category.json').then(testData => {
        const category = testData.validCategories.furniture.name;

        cy.request('GET', urls.category(category)).then(response => {
          expect(response.status).to.eq(200);
          expect(response.body.products).to.be.an('array');
          expect(response.body.products.length).to.be.greaterThan(0);

          // Validate all products are furniture category
          response.body.products.forEach((product: Product) => {
            expect(product.category).to.eq(category);
          });
        });
      });
    });

    it('should return products for groceries category', () => {
      cy.fixture('test-data/products-category.json').then(testData => {
        const category = testData.validCategories.groceries.name;

        cy.request('GET', urls.category(category)).then(response => {
          expect(response.status).to.eq(200);
          expect(response.body.products).to.be.an('array');
          expect(response.body.products.length).to.be.greaterThan(0);

          // Validate all products are groceries category
          response.body.products.forEach((product: Product) => {
            expect(product.category).to.eq(category);
          });
        });
      });
    });

    it('should return products for laptops category', () => {
      cy.fixture('test-data/products-category.json').then(testData => {
        const category = testData.validCategories.laptops.name;

        cy.request('GET', urls.category(category)).then(response => {
          expect(response.status).to.eq(200);
          expect(response.body.products).to.be.an('array');
          expect(response.body.products.length).to.be.greaterThan(0);

          // Validate all products are laptops category
          response.body.products.forEach((product: Product) => {
            expect(product.category).to.eq(category);
          });
        });
      });
    });

    it('should validate response metadata', () => {
      cy.fixture('test-data/products-category.json').then(testData => {
        cy.request(
          'GET',
          urls.category(testData.validCategories.smartphones.name)
        ).then(response => {
          const { total, skip, limit } = response.body;

          // Validate metadata types using fixture data
          Object.entries(testData.structureValidation.metadataTypes).forEach(
            ([field, expectedType]) => {
              if (expectedType === 'number') {
                expect(response.body[field]).to.be.a('number');
              }
            }
          );

          // Validate constraints using fixture data
          Object.entries(
            testData.structureValidation.metadataConstraints
          ).forEach(([field, constraints]: [string, any]) => {
            expect(response.body[field]).to.be.at.least(constraints.min);
          });

          // Validate consistency
          expect(response.body.products.length).to.eq(total);
          expect(skip).to.eq(0); // Default skip value
          expect(limit).to.eq(total); // Default limit is total count
        });
      });
    });

    it('should validate response headers', () => {
      cy.fixture('test-data/products-category.json').then(testData => {
        cy.request(
          'GET',
          urls.category(testData.validCategories.smartphones.name)
        ).then(response => {
          expect(response.headers).to.have.property('content-type');
          expect(response.headers['content-type']).to.include(
            testData.headers.expectedHeaders.contentType
          );
        });
      });
    });

    it('should validate response time is reasonable', () => {
      cy.fixture('test-data/products-category.json').then(testData => {
        cy.request(
          'GET',
          urls.category(testData.validCategories.smartphones.name)
        ).then(response => {
          expect(response.duration).to.be.lessThan(
            testData.validationRules.responseTimeLimit
          );
        });
      });
    });

    it('should handle request with custom headers', () => {
      cy.fixture('test-data/products-category.json').then(testData => {
        cy.request({
          method: 'GET',
          url: urls.category(testData.validCategories.smartphones.name),
          headers: testData.headers.customHeaders,
        }).then(response => {
          expect(response.status).to.eq(200);
          expect(response.body.products).to.be.an('array');
        });
      });
    });

    it('should validate products against categories endpoint', () => {
      // First get all categories
      cy.request('GET', urls.categories).then(categoriesResponse => {
        const categories = categoriesResponse.body;

        // Test first few categories
        const testCategories = categories.slice(0, 3);

        testCategories.forEach((category: any) => {
          cy.request('GET', urls.category(category.slug)).then(
            productsResponse => {
              expect(productsResponse.status).to.eq(200);
              expect(productsResponse.body.products).to.be.an('array');

              // Validate all products belong to the category
              productsResponse.body.products.forEach((product: Product) => {
                expect(product.category).to.eq(category.slug);
              });
            }
          );
        });
      });
    });

    // Edge Cases and Error Handling
    it('should handle non-existent category gracefully', () => {
      cy.fixture('test-data/products-category.json').then(testData => {
        const invalidCategory = testData.invalidCategories.nonExistent;

        cy.request({
          method: 'GET',
          url: urls.category(invalidCategory.name),
          failOnStatusCode: false,
        }).then(response => {
          // API might return 404 or empty products array
          expect(response.status).to.be.oneOf(invalidCategory.expectedStatus);

          if (response.status === 200) {
            expect(response.body.products).to.be.an('array');
            expect(response.body.products.length).to.eq(0);
          }
        });
      });
    });

    it('should handle empty category parameter', () => {
      cy.fixture('test-data/products-category.json').then(testData => {
        const invalidCategory = testData.invalidCategories.empty;

        cy.request({
          method: 'GET',
          url: urls.category(invalidCategory.name),
          failOnStatusCode: false,
        }).then(response => {
          // API might redirect or return error
          expect(response.status).to.be.oneOf(invalidCategory.expectedStatus);
        });
      });
    });

    it('should handle category with special characters', () => {
      cy.fixture('test-data/products-category.json').then(testData => {
        const invalidCategory = testData.invalidCategories.specialCharacters;

        cy.request({
          method: 'GET',
          url: urls.category(invalidCategory.name),
          failOnStatusCode: false,
        }).then(response => {
          expect(response.status).to.be.oneOf(invalidCategory.expectedStatus);
        });
      });
    });

    it('should handle category with spaces', () => {
      cy.fixture('test-data/products-category.json').then(testData => {
        const invalidCategory = testData.invalidCategories.spaces;

        cy.request({
          method: 'GET',
          url: urls.category(invalidCategory.name),
          failOnStatusCode: false,
        }).then(response => {
          expect(response.status).to.be.oneOf(invalidCategory.expectedStatus);
        });
      });
    });

    it('should handle category with uppercase letters', () => {
      cy.fixture('test-data/products-category.json').then(testData => {
        const invalidCategory = testData.invalidCategories.uppercase;

        cy.request({
          method: 'GET',
          url: urls.category(invalidCategory.name),
          failOnStatusCode: false,
        }).then(response => {
          expect(response.status).to.be.oneOf(invalidCategory.expectedStatus);
        });
      });
    });

    it('should handle very long category name', () => {
      cy.fixture('test-data/products-category.json').then(testData => {
        const invalidCategory = testData.invalidCategories.longName;

        cy.request({
          method: 'GET',
          url: urls.category(invalidCategory.name),
          failOnStatusCode: false,
        }).then(response => {
          expect(response.status).to.be.oneOf(invalidCategory.expectedStatus);
        });
      });
    });

    it('should handle SQL injection attempt in category', () => {
      cy.fixture('test-data/products-category.json').then(testData => {
        const invalidCategory = testData.invalidCategories.sqlInjection;

        cy.request({
          method: 'GET',
          url: urls.category(invalidCategory.name),
          failOnStatusCode: false,
        }).then(response => {
          expect(response.status).to.be.oneOf(invalidCategory.expectedStatus);
        });
      });
    });

    it('should handle XSS attempt in category', () => {
      cy.fixture('test-data/products-category.json').then(testData => {
        const invalidCategory = testData.invalidCategories.xssAttempt;

        cy.request({
          method: 'GET',
          url: urls.category(invalidCategory.name),
          failOnStatusCode: false,
        }).then(response => {
          expect(response.status).to.be.oneOf(invalidCategory.expectedStatus);
        });
      });
    });

    it('should handle emoji and unicode characters in category', () => {
      cy.fixture('test-data/products-category.json').then(testData => {
        const invalidCategory = testData.invalidCategories.emojiUnicode;

        cy.request({
          method: 'GET',
          url: urls.category(invalidCategory.name),
          failOnStatusCode: false,
        }).then(response => {
          expect(response.status).to.be.oneOf(invalidCategory.expectedStatus);
        });
      });
    });

    it('should handle multiple spaces in category', () => {
      cy.fixture('test-data/products-category.json').then(testData => {
        const invalidCategory = testData.invalidCategories.multipleSpaces;

        cy.request({
          method: 'GET',
          url: urls.category(invalidCategory.name),
          failOnStatusCode: false,
        }).then(response => {
          expect(response.status).to.be.oneOf(invalidCategory.expectedStatus);
        });
      });
    });

    it('should validate response structure consistency', () => {
      const requests: Cypress.Chainable<Cypress.Response<any>>[] = [];

      // Make multiple requests to ensure consistency
      for (let i = 0; i < 3; i++) {
        requests.push(cy.request('GET', urls.category('smartphones')));
      }

      cy.wrap(requests).then(() => {
        const responses: any[] = [];

        requests.forEach(request => {
          request.then((response: Cypress.Response<any>) => {
            responses.push(response.body);
          });
        });

        // All responses should have the same structure
        cy.wrap(responses).then((allResponses: any[]) => {
          allResponses.forEach(response => {
            expect(response).to.have.property('products');
            expect(response).to.have.property('total');
            expect(response).to.have.property('skip');
            expect(response).to.have.property('limit');
            expect(response.products).to.be.an('array');
          });
        });
      });
    });

    it('should validate products have consistent structure across categories', () => {
      const testCategories = ['smartphones', 'beauty', 'furniture'];

      testCategories.forEach(category => {
        cy.request('GET', urls.category(category)).then(response => {
          const products = response.body.products;

          if (products.length > 0) {
            const firstProduct = products[0];

            // All products should have the same basic structure
            expect(firstProduct).to.have.property('id');
            expect(firstProduct).to.have.property('title');
            expect(firstProduct).to.have.property('description');
            expect(firstProduct).to.have.property('price');
            expect(firstProduct).to.have.property('category');
            expect(firstProduct).to.have.property('brand');
            expect(firstProduct).to.have.property('stock');
            expect(firstProduct).to.have.property('rating');
            expect(firstProduct).to.have.property('images');
            expect(firstProduct).to.have.property('thumbnail');

            // Validate data types are consistent
            expect(firstProduct.id).to.be.a('number');
            expect(firstProduct.title).to.be.a('string');
            expect(firstProduct.description).to.be.a('string');
            expect(firstProduct.price).to.be.a('number');
            expect(firstProduct.category).to.be.a('string');
            expect(firstProduct.stock).to.be.a('number');
            expect(firstProduct.rating).to.be.a('number');
            expect(firstProduct.images).to.be.an('array');
            expect(firstProduct.thumbnail).to.be.a('string');
          }
        });
      });
    });

    it('should validate category consistency with search endpoint', () => {
      const category = 'smartphones';

      // Get products by category
      cy.request('GET', urls.category(category)).then(categoryResponse => {
        const categoryProducts = categoryResponse.body.products;

        // Search for the same category
        cy.request('GET', `${urls.search}?q=${category}`).then(
          searchResponse => {
            const searchProducts = searchResponse.body.products;

            // Both should return products with the same category
            categoryProducts.forEach((product: Product) => {
              expect(product.category).to.eq(category);
            });

            // Search results should include products from the category
            const categoryProductIds = categoryProducts.map(
              (p: Product) => p.id
            );
            const searchProductIds = searchProducts.map((p: Product) => p.id);

            // At least some products should be common
            const commonProducts = categoryProductIds.filter((id: number) =>
              searchProductIds.includes(id)
            );
            expect(commonProducts.length).to.be.greaterThan(0);
          }
        );
      });
    });
  });
});
