import { Category, Product } from '../../../support/types';
import { getProductUrls } from '../../../support/config';

describe('Products API - Categories Operations', () => {
  const urls = getProductUrls();

  describe('GET /products/categories', () => {
    it('should return all product categories with correct structure', () => {
      cy.fixture('test-data/products-categories.json').then(testData => {
        cy.request('GET', urls.categories).then(response => {
          // Validate response status
          expect(response.status).to.eq(200);

          // Validate response body is an array
          expect(response.body).to.be.an('array');
          expect(response.body.length).to.be.greaterThan(0);

          // Validate each category has required fields
          response.body.forEach((category: Category) => {
            expect(category).to.have.property('slug');
            expect(category).to.have.property('name');
            expect(category).to.have.property('url');

            // Validate data types
            expect(category.slug).to.be.a('string');
            expect(category.name).to.be.a('string');
            expect(category.url).to.be.a('string');

            // Validate URL format using fixture data
            expect(category.url).to.include(
              testData.validationRules.urlPattern
            );
            expect(category.url).to.include(category.slug);
          });
        });
      });
    });

    it('should validate categories have unique slugs', () => {
      cy.request('GET', urls.categories).then(response => {
        const categories = response.body;
        const slugs = categories.map((cat: Category) => cat.slug);
        const uniqueSlugs = [...new Set(slugs)];

        // All slugs should be unique
        expect(slugs.length).to.eq(uniqueSlugs.length);
      });
    });

    it('should validate categories have unique names', () => {
      cy.request('GET', urls.categories).then(response => {
        const categories = response.body;
        const names = categories.map((cat: Category) => cat.name);
        const uniqueNames = [...new Set(names)];

        // All names should be unique
        expect(names.length).to.eq(uniqueNames.length);
      });
    });

    it('should validate category URLs are accessible', () => {
      cy.request('GET', urls.categories).then(response => {
        const categories = response.body;

        // Test first few categories to ensure URLs are accessible
        const testCategories = categories.slice(0, 3);

        testCategories.forEach((category: Category) => {
          cy.request('GET', category.url).then(categoryResponse => {
            expect(categoryResponse.status).to.eq(200);
            expect(categoryResponse.body).to.have.property('products');
            expect(categoryResponse.body.products).to.be.an('array');
          });
        });
      });
    });

    it('should validate specific known categories exist', () => {
      cy.fixture('test-data/products-categories.json').then(testData => {
        cy.request('GET', urls.categories).then(response => {
          const categories = response.body;
          const slugs = categories.map((cat: Category) => cat.slug);
          const names = categories.map((cat: Category) => cat.name);

          // Check for expected categories from fixture
          Object.values(testData.expectedCategories).forEach(
            (expectedCategory: any) => {
              expect(slugs).to.include(expectedCategory.slug);
              expect(names).to.include(expectedCategory.name);
            }
          );
        });
      });
    });

    it('should validate category name and slug consistency', () => {
      cy.request('GET', urls.categories).then(response => {
        const categories = response.body;

        categories.forEach((category: Category) => {
          // Slug should contain only lowercase letters and hyphens
          expect(category.slug).to.match(/^[a-z-]+$/);
        });
      });
    });

    it('should validate response headers', () => {
      cy.fixture('test-data/products-categories.json').then(testData => {
        cy.request('GET', urls.categories).then(response => {
          // Validate content type
          expect(response.headers['content-type']).to.include(
            testData.headers.expectedHeaders.contentType
          );

          // Validate CORS headers
          expect(response.headers['access-control-allow-origin']).to.eq(
            testData.headers.expectedHeaders.corsOrigin
          );
        });
      });
    });

    it('should handle request with custom headers', () => {
      cy.fixture('test-data/products-categories.json').then(testData => {
        cy.request({
          method: 'GET',
          url: urls.categories,
          headers: testData.headers.customHeaders,
        }).then(response => {
          expect(response.status).to.eq(200);
          expect(response.body).to.be.an('array');
          expect(response.body.length).to.be.greaterThan(0);
        });
      });
    });

    it('should validate categories are sorted consistently', () => {
      cy.request('GET', urls.categories).then(response => {
        const categories = response.body;

        // Categories should be sorted alphabetically by name
        const names = categories.map((cat: Category) => cat.name);
        const sortedNames = [...names].sort();

        expect(names).to.deep.equal(sortedNames);
      });
    });

    it('should validate category count is reasonable', () => {
      cy.fixture('test-data/products-categories.json').then(testData => {
        cy.request('GET', urls.categories).then(response => {
          const categories = response.body;

          // Should have a reasonable number of categories using fixture data
          expect(categories.length).to.be.at.least(
            testData.validationRules.minCount
          );
          expect(categories.length).to.be.at.most(
            testData.validationRules.maxCount
          );
        });
      });
    });

    it('should validate category data integrity', () => {
      cy.request('GET', urls.categories).then(response => {
        const categories = response.body;

        categories.forEach((category: any) => {
          // No empty values
          expect(category.slug).to.not.be.empty;
          expect(category.name).to.not.be.empty;
          expect(category.url).to.not.be.empty;

          // No null values
          expect(category.slug).to.not.be.null;
          expect(category.name).to.not.be.null;
          expect(category.url).to.not.be.null;

          // No undefined values
          expect(category.slug).to.not.be.undefined;
          expect(category.name).to.not.be.undefined;
          expect(category.url).to.not.be.undefined;
        });
      });
    });

    it('should validate response time is reasonable', () => {
      cy.fixture('test-data/products-categories.json').then(testData => {
        cy.request('GET', urls.categories).then(response => {
          // Response should be fast using fixture data
          expect(response.duration).to.be.lessThan(
            testData.validationRules.responseTimeLimit
          );
        });
      });
    });

    it('should handle concurrent requests', () => {
      cy.fixture('test-data/products-categories.json').then(testData => {
        // Make multiple concurrent requests using fixture data
        const requests: Cypress.Chainable<Cypress.Response<any>>[] = [];

        for (let i = 0; i < testData.concurrentTest.requestCount; i++) {
          requests.push(cy.request('GET', urls.categories));
        }

        cy.wrap(requests).then(() => {
          requests.forEach(request => {
            request.then((response: Cypress.Response<any>) => {
              expect(response.status).to.eq(200);
              expect(response.body).to.be.an('array');
              expect(response.body.length).to.be.greaterThan(0);
            });
          });
        });
      });
    });

    it('should validate categories against product data', () => {
      // First get categories
      cy.request('GET', urls.categories).then(categoriesResponse => {
        const categories = categoriesResponse.body;
        const categorySlugs = categories.map((cat: Category) => cat.slug);

        // Then get all products to verify categories match
        cy.request('GET', urls.getAll).then(productsResponse => {
          const products = productsResponse.body.products;
          const productCategories = [
            ...new Set(products.map((p: Product) => p.category)),
          ];

          // All product categories should exist in categories list
          productCategories.forEach(productCategory => {
            expect(categorySlugs).to.include(productCategory);
          });
        });
      });
    });

    // Edge Cases
    it('should handle request with query parameters gracefully', () => {
      cy.fixture('test-data/products-categories.json').then(testData => {
        const queryParams = new URLSearchParams(
          testData.queryParameters.valid
        ).toString();
        cy.request('GET', `${urls.categories}?${queryParams}`).then(
          response => {
            // API should ignore query parameters and return all categories
            expect(response.status).to.eq(200);
            expect(response.body).to.be.an('array');
            expect(response.body.length).to.be.greaterThan(0);
          }
        );
      });
    });

    it('should handle request with invalid query parameters', () => {
      cy.fixture('test-data/products-categories.json').then(testData => {
        const queryParams = new URLSearchParams(
          testData.queryParameters.invalid
        ).toString();
        cy.request('GET', `${urls.categories}?${queryParams}`).then(
          response => {
            // API should ignore invalid parameters and return all categories
            expect(response.status).to.eq(200);
            expect(response.body).to.be.an('array');
            expect(response.body.length).to.be.greaterThan(0);
          }
        );
      });
    });

    it('should handle request with empty query parameters', () => {
      cy.fixture('test-data/products-categories.json').then(testData => {
        const queryParams = new URLSearchParams(
          testData.queryParameters.empty
        ).toString();
        cy.request('GET', `${urls.categories}?${queryParams}`).then(
          response => {
            expect(response.status).to.eq(200);
            expect(response.body).to.be.an('array');
            expect(response.body.length).to.be.greaterThan(0);
          }
        );
      });
    });

    it('should handle request with special characters in query parameters', () => {
      cy.fixture('test-data/products-categories.json').then(testData => {
        const queryParams = new URLSearchParams(
          testData.queryParameters.specialCharacters
        ).toString();
        cy.request('GET', `${urls.categories}?${queryParams}`).then(
          response => {
            expect(response.status).to.eq(200);
            expect(response.body).to.be.an('array');
            expect(response.body.length).to.be.greaterThan(0);
          }
        );
      });
    });

    it('should handle request with very long query parameters', () => {
      cy.fixture('test-data/products-categories.json').then(testData => {
        const queryParams = new URLSearchParams(
          testData.queryParameters.longParameter
        ).toString();
        cy.request('GET', `${urls.categories}?${queryParams}`).then(
          response => {
            expect(response.status).to.eq(200);
            expect(response.body).to.be.an('array');
            expect(response.body.length).to.be.greaterThan(0);
          }
        );
      });
    });

    it('should handle request with SQL injection attempt', () => {
      cy.fixture('test-data/products-categories.json').then(testData => {
        const queryParams = new URLSearchParams(
          testData.queryParameters.sqlInjection
        ).toString();
        cy.request('GET', `${urls.categories}?${queryParams}`).then(
          response => {
            expect(response.status).to.eq(200);
            expect(response.body).to.be.an('array');
            expect(response.body.length).to.be.greaterThan(0);
          }
        );
      });
    });

    it('should handle request with XSS attempt', () => {
      cy.fixture('test-data/products-categories.json').then(testData => {
        const queryParams = new URLSearchParams(
          testData.queryParameters.xssAttempt
        ).toString();
        cy.request('GET', `${urls.categories}?${queryParams}`).then(
          response => {
            expect(response.status).to.eq(200);
            expect(response.body).to.be.an('array');
            expect(response.body.length).to.be.greaterThan(0);
          }
        );
      });
    });

    it('should handle request with emoji and unicode characters', () => {
      cy.fixture('test-data/products-categories.json').then(testData => {
        const queryParams = new URLSearchParams(
          testData.queryParameters.emojiUnicode
        ).toString();
        cy.request('GET', `${urls.categories}?${queryParams}`).then(
          response => {
            expect(response.status).to.eq(200);
            expect(response.body).to.be.an('array');
            expect(response.body.length).to.be.greaterThan(0);
          }
        );
      });
    });

    it('should handle request with multiple spaces in query parameters', () => {
      cy.fixture('test-data/products-categories.json').then(testData => {
        const queryParams = new URLSearchParams(
          testData.queryParameters.multipleSpaces
        ).toString();
        cy.request('GET', `${urls.categories}?${queryParams}`).then(
          response => {
            expect(response.status).to.eq(200);
            expect(response.body).to.be.an('array');
            expect(response.body.length).to.be.greaterThan(0);
          }
        );
      });
    });

    it('should validate response structure consistency', () => {
      // Make multiple requests and compare structure
      const requests = [
        cy.request('GET', urls.categories),
        cy.request('GET', urls.categories),
        cy.request('GET', urls.categories),
      ];

      cy.wrap(requests).then(() => {
        requests.forEach(request => {
          request.then(response => {
            expect(response.status).to.eq(200);
            expect(response.body).to.be.an('array');
            expect(response.body.length).to.be.greaterThan(0);

            // Validate first category structure
            if (response.body.length > 0) {
              const firstCategory = response.body[0];
              expect(firstCategory).to.have.property('slug');
              expect(firstCategory).to.have.property('name');
              expect(firstCategory).to.have.property('url');
            }
          });
        });
      });
    });
  });
});
