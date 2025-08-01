import { Category } from '../../../support/types';
import { getProductUrls } from '../../../support/config';

describe('Products API - Category List Operations', () => {
  const urls = getProductUrls();

  describe('GET /products/category-list', () => {
    it('should return category list with correct structure', () => {
      cy.fixture('test-data/products-category-list.json').then(testData => {
        cy.request('GET', urls.categoryList).then(response => {
          // Validate response structure
          expect(response.status).to.eq(200);
          expect(response.body).to.be.an(
            testData.structureValidation.arrayType
          );
          expect(response.body.length).to.be.greaterThan(0);

          // Validate all items are strings
          response.body.forEach((category: string) => {
            expect(category).to.be.a(testData.structureValidation.dataType);
            expect(category.length).to.be.greaterThan(0);
          });
        });
      });
    });

    it('should validate all categories are unique', () => {
      cy.request('GET', urls.categoryList).then(response => {
        const categories = response.body;
        const uniqueCategories = [...new Set(categories)];

        expect(uniqueCategories.length).to.eq(categories.length);
      });
    });

    it('should validate categories are in slug format', () => {
      cy.fixture('test-data/products-category-list.json').then(testData => {
        cy.request('GET', urls.categoryList).then(response => {
          const categories = response.body;

          // Validate slug format using fixture data
          categories.forEach((category: string) => {
            expect(category).to.match(
              new RegExp(testData.validationRules.slugPattern)
            );
            expect(category).to.not.include(' ');
            expect(category).to.not.include('_');
          });
        });
      });
    });

    it('should validate specific known categories exist', () => {
      cy.fixture('test-data/products-category-list.json').then(testData => {
        cy.request('GET', urls.categoryList).then(response => {
          const categories = response.body;

          // Validate expected categories from fixture
          testData.expectedCategories.forEach((expectedCategory: string) => {
            expect(categories).to.include(expectedCategory);
          });
        });
      });
    });

    it('should validate category count is reasonable', () => {
      cy.fixture('test-data/products-category-list.json').then(testData => {
        cy.request('GET', urls.categoryList).then(response => {
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

    it('should validate response headers', () => {
      cy.fixture('test-data/products-category-list.json').then(testData => {
        cy.request('GET', urls.categoryList).then(response => {
          expect(response.headers).to.have.property('content-type');
          expect(response.headers['content-type']).to.include(
            testData.headers.expectedHeaders.contentType
          );
        });
      });
    });

    it('should validate response time is reasonable', () => {
      cy.fixture('test-data/products-category-list.json').then(testData => {
        cy.request('GET', urls.categoryList).then(response => {
          expect(response.duration).to.be.lessThan(
            testData.validationRules.responseTimeLimit
          );
        });
      });
    });

    it('should validate categories against detailed categories endpoint', () => {
      // Get category list
      cy.request('GET', urls.categoryList).then(categoryListResponse => {
        const categoryList = categoryListResponse.body;

        // Get detailed categories
        cy.request('GET', urls.categories).then(detailedCategoriesResponse => {
          const detailedCategories = detailedCategoriesResponse.body;

          // Validate both endpoints return the same number of categories
          expect(categoryList.length).to.eq(detailedCategories.length);

          // Validate all category list items exist in detailed categories
          categoryList.forEach((categorySlug: string) => {
            const matchingDetailedCategory = detailedCategories.find(
              (cat: Category) => cat.slug === categorySlug
            );
            expect(matchingDetailedCategory).to.exist;
          });
        });
      });
    });

    it('should handle request with query parameters gracefully', () => {
      cy.fixture('test-data/products-category-list.json').then(testData => {
        const queryParams = new URLSearchParams(
          testData.queryParameters.valid
        ).toString();
        cy.request({
          method: 'GET',
          url: `${urls.categoryList}?${queryParams}`,
          failOnStatusCode: false,
        }).then(response => {
          // Should still return 200 even with query parameters
          expect(response.status).to.eq(200);
          expect(response.body).to.be.an('array');
        });
      });
    });

    it('should validate categories are sorted consistently', () => {
      cy.request('GET', urls.categoryList).then(response => {
        const categories = response.body;

        // Categories should be sorted alphabetically
        const sortedCategories = [...categories].sort();
        expect(categories).to.deep.equal(sortedCategories);
      });
    });

    it('should validate no empty or null categories', () => {
      cy.request('GET', urls.categoryList).then(response => {
        const categories = response.body;

        categories.forEach((category: string) => {
          expect(category).to.not.be.empty;
          expect(category).to.not.be.null;
          expect(category).to.not.be.undefined;
        });
      });
    });

    it('should validate categories contain only valid characters', () => {
      cy.fixture('test-data/products-category-list.json').then(testData => {
        cy.request('GET', urls.categoryList).then(response => {
          const categories = response.body;

          categories.forEach((category: string) => {
            // Should only contain lowercase letters, numbers, and hyphens using fixture data
            expect(category).to.match(
              new RegExp(testData.validationRules.slugPattern)
            );
            // Should not start or end with hyphen
            expect(category).to.not.match(
              new RegExp(testData.validationRules.noLeadingTrailingHyphen)
            );
            // Should not have consecutive hyphens
            expect(category).to.not.include(
              testData.validationRules.noConsecutiveHyphens
            );
          });
        });
      });
    });

    // Additional Edge Cases and Security Tests
    it('should handle request with custom headers', () => {
      cy.fixture('test-data/products-category-list.json').then(testData => {
        cy.request({
          method: 'GET',
          url: urls.categoryList,
          headers: testData.headers.customHeaders,
        }).then(response => {
          expect(response.status).to.eq(200);
          expect(response.body).to.be.an('array');
        });
      });
    });

    it('should handle request with invalid query parameters', () => {
      cy.fixture('test-data/products-category-list.json').then(testData => {
        const queryParams = new URLSearchParams(
          testData.queryParameters.invalid
        ).toString();
        cy.request({
          method: 'GET',
          url: `${urls.categoryList}?${queryParams}`,
          failOnStatusCode: false,
        }).then(response => {
          // Should still return 200 even with invalid parameters
          expect(response.status).to.eq(200);
          expect(response.body).to.be.an('array');
        });
      });
    });

    it('should handle request with empty query parameters', () => {
      cy.fixture('test-data/products-category-list.json').then(testData => {
        const queryParams = new URLSearchParams(
          testData.queryParameters.empty
        ).toString();
        cy.request({
          method: 'GET',
          url: `${urls.categoryList}?${queryParams}`,
          failOnStatusCode: false,
        }).then(response => {
          expect(response.status).to.eq(200);
          expect(response.body).to.be.an('array');
        });
      });
    });

    it('should handle request with special characters in query parameters', () => {
      cy.fixture('test-data/products-category-list.json').then(testData => {
        const queryParams = new URLSearchParams(
          testData.queryParameters.specialCharacters
        ).toString();
        cy.request({
          method: 'GET',
          url: `${urls.categoryList}?${queryParams}`,
          failOnStatusCode: false,
        }).then(response => {
          expect(response.status).to.eq(200);
          expect(response.body).to.be.an('array');
        });
      });
    });

    it('should handle request with very long query parameters', () => {
      cy.fixture('test-data/products-category-list.json').then(testData => {
        const queryParams = new URLSearchParams(
          testData.queryParameters.longParameter
        ).toString();
        cy.request({
          method: 'GET',
          url: `${urls.categoryList}?${queryParams}`,
          failOnStatusCode: false,
        }).then(response => {
          expect(response.status).to.eq(200);
          expect(response.body).to.be.an('array');
        });
      });
    });

    it('should handle request with SQL injection attempt', () => {
      cy.fixture('test-data/products-category-list.json').then(testData => {
        const queryParams = new URLSearchParams(
          testData.queryParameters.sqlInjection
        ).toString();
        cy.request({
          method: 'GET',
          url: `${urls.categoryList}?${queryParams}`,
          failOnStatusCode: false,
        }).then(response => {
          expect(response.status).to.eq(200);
          expect(response.body).to.be.an('array');
        });
      });
    });

    it('should handle request with XSS attempt', () => {
      cy.fixture('test-data/products-category-list.json').then(testData => {
        const queryParams = new URLSearchParams(
          testData.queryParameters.xssAttempt
        ).toString();
        cy.request({
          method: 'GET',
          url: `${urls.categoryList}?${queryParams}`,
          failOnStatusCode: false,
        }).then(response => {
          expect(response.status).to.eq(200);
          expect(response.body).to.be.an('array');
        });
      });
    });

    it('should handle request with emoji and unicode characters', () => {
      cy.fixture('test-data/products-category-list.json').then(testData => {
        const queryParams = new URLSearchParams(
          testData.queryParameters.emojiUnicode
        ).toString();
        cy.request({
          method: 'GET',
          url: `${urls.categoryList}?${queryParams}`,
          failOnStatusCode: false,
        }).then(response => {
          expect(response.status).to.eq(200);
          expect(response.body).to.be.an('array');
        });
      });
    });

    it('should handle request with multiple spaces in query parameters', () => {
      cy.fixture('test-data/products-category-list.json').then(testData => {
        const queryParams = new URLSearchParams(
          testData.queryParameters.multipleSpaces
        ).toString();
        cy.request({
          method: 'GET',
          url: `${urls.categoryList}?${queryParams}`,
          failOnStatusCode: false,
        }).then(response => {
          expect(response.status).to.eq(200);
          expect(response.body).to.be.an('array');
        });
      });
    });

    it('should validate response structure consistency', () => {
      cy.fixture('test-data/products-category-list.json').then(testData => {
        const requests: Cypress.Chainable<Cypress.Response<any>>[] = [];

        // Make multiple requests to ensure consistency using fixture data
        for (let i = 0; i < testData.concurrentTest.requestCount; i++) {
          requests.push(cy.request('GET', urls.categoryList));
        }

        cy.wrap(requests).then(() => {
          const responses: string[][] = [];

          requests.forEach(request => {
            request.then((response: Cypress.Response<any>) => {
              responses.push(response.body);
            });
          });

          // All responses should have the same structure and length
          cy.wrap(responses).then((allResponses: string[][]) => {
            const firstResponse = allResponses[0];
            const firstLength = firstResponse.length;

            allResponses.forEach((response: string[]) => {
              expect(response).to.be.an('array');
              expect(response.length).to.eq(firstLength);
            });
          });
        });
      });
    });

    it('should validate categories have consistent naming pattern', () => {
      cy.fixture('test-data/products-category-list.json').then(testData => {
        cy.request('GET', urls.categoryList).then(response => {
          const categories = response.body;

          categories.forEach((category: string) => {
            // Should not contain uppercase letters using fixture data
            expect(category).to.not.match(
              new RegExp(testData.validationRules.noUppercasePattern)
            );
            // Should not contain special characters except hyphens
            expect(category).to.not.match(
              new RegExp(testData.validationRules.noSpecialCharsPattern)
            );
            // Should be at least 3 characters long
            expect(category.length).to.be.at.least(
              testData.validationRules.minCategoryLength
            );
          });
        });
      });
    });

    it('should validate categories are properly formatted slugs', () => {
      cy.fixture('test-data/products-category-list.json').then(testData => {
        cy.request('GET', urls.categoryList).then(response => {
          const categories = response.body;

          categories.forEach((category: string) => {
            // Should not have leading or trailing hyphens using fixture data
            expect(category).to.not.match(
              new RegExp(testData.validationRules.noLeadingTrailingHyphen)
            );
            // Should not have consecutive hyphens
            expect(category).to.not.include(
              testData.validationRules.noConsecutiveHyphens
            );
            // Should not have spaces
            expect(category).to.not.include(' ');
            // Should not have underscores
            expect(category).to.not.include('_');
          });
        });
      });
    });
  });
});
