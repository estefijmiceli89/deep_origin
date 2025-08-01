import { Product } from '../../../support/types';
import { getProductUrls } from '../../../support/config';

describe('Products API - Search Operations', () => {
  const urls = getProductUrls();

  describe('GET /products/search', () => {
    it('should search products by query and return correct structure', () => {
      cy.fixture('test-data/products-search').then(testData => {
        const searchQuery = testData.searchQueries.phone.query;

        cy.request('GET', `${urls.search}?q=${searchQuery}`).then(response => {
          // Validate response structure using custom command
          cy.validateSearchResponse(response);

          // Validate response time
          cy.checkResponseTime(
            response,
            testData.validationRules.responseTimeLimit
          );

          // Validate search results match query
          cy.validateProductMatchesSearch(response.body.products, searchQuery);

          // Validate search results are not empty
          expect(response.body.total).to.be.greaterThan(0);
          expect(response.body.products.length).to.be.greaterThan(0);
        });
      });
    });

    it('should search for beauty products', () => {
      cy.fixture('test-data/products-search').then(testData => {
        const searchQuery = testData.searchQueries.beauty.query;

        cy.request('GET', `${urls.search}?q=${searchQuery}`).then(response => {
          cy.validateSearchResponse(response);

          // Validate all products are beauty-related
          response.body.products.forEach((product: Product) => {
            const searchableText =
              `${product.title} ${product.description} ${product.category} ${product.brand}`.toLowerCase();
            expect(searchableText).to.include(searchQuery.toLowerCase());
          });
        });
      });
    });

    it('should search for electronics', () => {
      cy.fixture('test-data/products-search').then(testData => {
        const searchQuery = testData.searchQueries.electronics.query;

        cy.request('GET', `${urls.search}?q=${searchQuery}`).then(response => {
          cy.validateSearchResponse(response);

          // Validate all products are electronics-related
          response.body.products.forEach((product: Product) => {
            const searchableText =
              `${product.title} ${product.description} ${product.category} ${product.brand}`.toLowerCase();
            expect(searchableText).to.include(searchQuery.toLowerCase());
          });
        });
      });
    });

    it('should handle empty search query', () => {
      cy.fixture('test-data/products-search').then(testData => {
        const searchQuery = testData.searchQueries.empty.query;

        cy.request('GET', `${urls.search}?q=${searchQuery}`).then(response => {
          cy.validateSearchResponse(response);

          // Should return all products or empty results
          expect(response.body.products).to.be.an('array');
          expect(response.body.total).to.be.at.least(0);
        });
      });
    });

    it('should handle search with special characters', () => {
      cy.fixture('test-data/products-search').then(testData => {
        const searchQuery = testData.searchQueries.iPhone.query;

        cy.request('GET', `${urls.search}?q=${searchQuery}`).then(response => {
          cy.validateSearchResponse(response);

          // Validate search results
          expect(response.body.products).to.be.an('array');
          expect(response.body.total).to.be.at.least(0);

          // If results found, validate they match the search
          if (response.body.products.length > 0) {
            cy.validateProductMatchesSearch(
              response.body.products,
              searchQuery
            );
          }
        });
      });
    });

    it('should handle search with multiple words', () => {
      cy.fixture('test-data/products-search').then(testData => {
        const searchQuery = testData.searchQueries.wirelessHeadphones.query;

        cy.request('GET', `${urls.search}?q=${searchQuery}`).then(response => {
          cy.validateSearchResponse(response);

          // Validate search results
          expect(response.body.products).to.be.an('array');
          expect(response.body.total).to.be.at.least(0);

          // If results found, validate they match the search
          if (response.body.products.length > 0) {
            cy.validateProductMatchesSearch(
              response.body.products,
              searchQuery
            );
          }
        });
      });
    });

    it('should validate search result product structure', () => {
      cy.fixture('test-data/products-search').then(testData => {
        const searchQuery = testData.searchQueries.laptop.query;

        cy.request('GET', `${urls.search}?q=${searchQuery}`).then(response => {
          cy.validateSearchResponse(response);

          // Validate each product in search results
          response.body.products.forEach((product: Product) => {
            // Validate basic product structure
            cy.validateSingleProduct(product);

            // Validate data types
            cy.validateProductDataTypes(product);

            // Validate search relevance
            const searchableText =
              `${product.title} ${product.description} ${product.category} ${product.brand}`.toLowerCase();
            expect(searchableText).to.include(searchQuery.toLowerCase());
          });
        });
      });
    });

    it('should handle case insensitive search', () => {
      cy.fixture('test-data/products-search').then(testData => {
        const searchQuery = testData.searchQueries.PHONE.query;

        cy.request('GET', `${urls.search}?q=${searchQuery}`).then(response => {
          cy.validateSearchResponse(response);

          // Validate search results are case insensitive
          response.body.products.forEach((product: Product) => {
            const searchableText =
              `${product.title} ${product.description} ${product.category} ${product.brand}`.toLowerCase();
            expect(searchableText).to.include(searchQuery.toLowerCase());
          });
        });
      });
    });

    it('should validate search with pagination', () => {
      cy.fixture('test-data/products-search').then(testData => {
        const searchQuery = testData.searchQueries.phone.query;
        const paginationData = testData.pagination.basic;

        cy.request(
          'GET',
          `${urls.search}?q=${searchQuery}&limit=${paginationData.limit}&skip=${paginationData.skip}`
        ).then(response => {
          cy.validateSearchResponse(response);

          // Validate pagination parameters
          expect(response.body.limit).to.eq(paginationData.limit);
          expect(response.body.skip).to.eq(paginationData.skip);
          expect(response.body.products.length).to.be.at.most(
            paginationData.limit
          );

          // Validate search relevance
          if (response.body.products.length > 0) {
            cy.validateProductMatchesSearch(
              response.body.products,
              searchQuery
            );
          }
        });
      });
    });

    it('should handle search with no results', () => {
      cy.fixture('test-data/products-search').then(testData => {
        const searchQuery = testData.searchQueries.nonexistent.query;

        cy.request('GET', `${urls.search}?q=${searchQuery}`).then(response => {
          cy.validateSearchResponse(response);

          // Should return empty results
          expect(response.body.products).to.be.an('array');
          expect(response.body.products.length).to.eq(0);
          expect(response.body.total).to.eq(0);
        });
      });
    });

    it('should validate search result metadata', () => {
      cy.fixture('test-data/products-search').then(testData => {
        const searchQuery = testData.searchQueries.smartphone.query;

        cy.request('GET', `${urls.search}?q=${searchQuery}`).then(response => {
          cy.validateSearchResponse(response);

          // Validate metadata structure
          expect(response.body).to.have.property('total');
          expect(response.body).to.have.property('skip');
          expect(response.body).to.have.property('limit');

          // Validate metadata values
          expect(response.body.total).to.be.a('number');
          expect(response.body.skip).to.be.a('number');
          expect(response.body.limit).to.be.a('number');
          expect(response.body.total).to.be.at.least(0);
          expect(response.body.skip).to.be.at.least(0);
          expect(response.body.limit).to.be.greaterThan(0);
        });
      });
    });

    // Boundary and Edge Cases Tests
    it('should handle boundary case with limit=1 in search', () => {
      cy.fixture('test-data/products-search').then(testData => {
        const searchQuery = testData.searchQueries.phone.query;
        const paginationData = testData.pagination.boundary;

        cy.request(
          'GET',
          `${urls.search}?q=${searchQuery}&limit=${paginationData.limit}`
        ).then(response => {
          cy.validateSearchResponse(response);

          // Validate boundary conditions
          expect(response.body.limit).to.eq(paginationData.limit);
          expect(response.body.products).to.have.length(paginationData.limit);
          expect(response.body.skip).to.eq(paginationData.skip);
          expect(response.body.total).to.be.greaterThan(0);

          // Validate first product structure
          const firstProduct = response.body.products[0];
          cy.validateSingleProduct(firstProduct);
        });
      });
    });

    it('should handle boundary case with skip=0 in search', () => {
      const searchQuery = 'phone';

      cy.request('GET', `${urls.search}?q=${searchQuery}&skip=0&limit=5`).then(
        response => {
          cy.validateSearchResponse(response);

          // Validate boundary conditions
          expect(response.body.skip).to.eq(0);
          expect(response.body.limit).to.eq(5);
          expect(response.body.products).to.have.length.at.most(5);
          expect(response.body.total).to.be.greaterThan(0);
        }
      );
    });

    it('should handle edge case with very large limit in search', () => {
      const searchQuery = 'phone';
      const veryLargeLimit = 9999;

      cy.request(
        'GET',
        `${urls.search}?q=${searchQuery}&limit=${veryLargeLimit}`
      ).then(response => {
        cy.validateSearchResponse(response);

        // Validate that API handles large limit gracefully
        expect(response.body.limit).to.be.at.most(veryLargeLimit);
        expect(response.body.skip).to.eq(0);
        expect(response.body.products).to.be.an('array');
        expect(response.body.products.length).to.be.at.most(veryLargeLimit);
        expect(response.body.products.length).to.be.greaterThan(0);
      });
    });

    it('should handle edge case with skip greater than total results', () => {
      const searchQuery = 'phone';

      // First, get total results
      cy.request('GET', `${urls.search}?q=${searchQuery}`).then(
        totalResponse => {
          const totalResults = totalResponse.body.total;
          const skipGreaterThanTotal = totalResults + 10;

          cy.request(
            'GET',
            `${urls.search}?q=${searchQuery}&skip=${skipGreaterThanTotal}`
          ).then(response => {
            cy.validateSearchResponse(response);

            // Validate edge conditions
            expect(response.body.skip).to.eq(skipGreaterThanTotal);
            expect(response.body.products).to.be.an('array');
            expect(response.body.products.length).to.eq(0);
            expect(response.body.total).to.eq(totalResults);
          });
        }
      );
    });

    it('should handle edge case with negative limit in search', () => {
      const searchQuery = 'phone';

      cy.request('GET', `${urls.search}?q=${searchQuery}&limit=-5`).then(
        response => {
          cy.validateSearchResponse(response);

          // API should handle negative limit gracefully
          expect(response.body.products).to.be.an('array');
          expect(response.body.total).to.be.greaterThan(0);
          expect(response.body.products.length).to.be.greaterThan(0);
        }
      );
    });

    it('should handle edge case with negative skip in search', () => {
      const searchQuery = 'phone';

      cy.request('GET', `${urls.search}?q=${searchQuery}&skip=-10`).then(
        response => {
          cy.validateSearchResponse(response);

          // API should handle negative skip gracefully
          expect(response.body.products).to.be.an('array');
          expect(response.body.total).to.be.greaterThan(0);
          expect(response.body.products.length).to.be.greaterThan(0);
        }
      );
    });

    it('should handle edge case with invalid limit parameter in search', () => {
      const searchQuery = 'phone';

      cy.request({
        method: 'GET',
        url: `${urls.search}?q=${searchQuery}&limit=abc`,
        failOnStatusCode: false,
      }).then(response => {
        // API should handle invalid limit gracefully
        expect(response.status).to.be.oneOf([200, 400, 500]);
        if (response.status === 200) {
          expect(response.body.products).to.be.an('array');
          expect(response.body.total).to.be.greaterThan(0);
        }
      });
    });

    it('should handle edge case with invalid skip parameter in search', () => {
      const searchQuery = 'phone';

      cy.request({
        method: 'GET',
        url: `${urls.search}?q=${searchQuery}&skip=xyz`,
        failOnStatusCode: false,
      }).then(response => {
        // API should handle invalid skip gracefully
        expect(response.status).to.be.oneOf([200, 400, 500]);
        if (response.status === 200) {
          expect(response.body.products).to.be.an('array');
          expect(response.body.total).to.be.greaterThan(0);
        }
      });
    });

    it('should handle edge case with very long search query', () => {
      cy.fixture('test-data/products-search').then(testData => {
        const veryLongQuery = testData.edgeCases.veryLongQuery.query;

        cy.request('GET', `${urls.search}?q=${veryLongQuery}`).then(
          response => {
            cy.validateSearchResponse(response);

            // API should handle very long query gracefully
            expect(response.body.products).to.be.an('array');
            expect(response.body.total).to.be.at.least(0);
          }
        );
      });
    });

    it('should handle edge case with SQL injection attempt in search', () => {
      cy.fixture('test-data/products-search').then(testData => {
        const sqlInjectionAttempts = testData.edgeCases.sqlInjection.attempts;

        sqlInjectionAttempts.forEach((attempt: string) => {
          cy.request(
            'GET',
            `${urls.search}?q=${encodeURIComponent(attempt)}`
          ).then(response => {
            cy.validateSearchResponse(response);

            // API should handle SQL injection attempts gracefully
            expect(response.body.products).to.be.an('array');
            expect(response.body.total).to.be.at.least(0);
          });
        });
      });
    });

    it('should handle edge case with XSS attempt in search', () => {
      cy.fixture('test-data/products-search').then(testData => {
        const xssAttempts = testData.edgeCases.xssAttempts.attempts;

        xssAttempts.forEach((attempt: string) => {
          cy.request(
            'GET',
            `${urls.search}?q=${encodeURIComponent(attempt)}`
          ).then(response => {
            cy.validateSearchResponse(response);

            // API should handle XSS attempts gracefully
            expect(response.body.products).to.be.an('array');
            expect(response.body.total).to.be.at.least(0);
          });
        });
      });
    });

    it('should handle edge case with emoji and unicode in search', () => {
      cy.fixture('test-data/products-search').then(testData => {
        const unicodeQueries = testData.edgeCases.unicodeQueries.queries;

        unicodeQueries.forEach((query: string) => {
          cy.request(
            'GET',
            `${urls.search}?q=${encodeURIComponent(query)}`
          ).then(response => {
            cy.validateSearchResponse(response);

            // API should handle unicode gracefully
            expect(response.body.products).to.be.an('array');
            expect(response.body.total).to.be.at.least(0);
          });
        });
      });
    });

    it('should handle edge case with multiple spaces in search query', () => {
      cy.fixture('test-data/products-search').then(testData => {
        const searchQuery = testData.edgeCases.multipleSpaces.query;

        cy.request(
          'GET',
          `${urls.search}?q=${encodeURIComponent(searchQuery)}`
        ).then(response => {
          cy.validateSearchResponse(response);

          // API should handle multiple spaces gracefully
          expect(response.body.products).to.be.an('array');
          expect(response.body.total).to.be.at.least(0);
        });
      });
    });

    it('should handle edge case with empty query parameters', () => {
      cy.fixture('test-data/products-search').then(testData => {
        const emptyParams = testData.edgeCases.emptyParameters;

        cy.request(
          'GET',
          `${urls.search}?q=${emptyParams.query}&limit=${emptyParams.limit}&skip=${emptyParams.skip}`
        ).then(response => {
          cy.validateSearchResponse(response);

          // API should handle empty parameters gracefully
          expect(response.body.products).to.be.an('array');
          expect(response.body.total).to.be.at.least(0);
        });
      });
    });
  });
});
