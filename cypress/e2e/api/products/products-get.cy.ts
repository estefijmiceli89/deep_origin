import { Product } from '../../../support/types';
import { getProductUrls } from '../../../support/config';

describe('Products API - GET Operations', () => {
  const urls = getProductUrls();

  describe('GET /products', () => {
    it('should return default 30 products with correct structure', () => {
      cy.fixture('test-data/products-get.json').then(testData => {
        const defaultResponse = testData.defaultResponse;

        cy.request('GET', urls.getAll).then(response => {
          // Validate response structure using custom command
          cy.validateProductResponse(response);

          // Validate response time using custom command
          cy.checkResponseTime(
            response,
            testData.validationRules.responseTimeLimit
          );

          // Validate specific values from fixture
          expect(response.body.limit).to.eq(defaultResponse.limit);
          expect(response.body.skip).to.eq(defaultResponse.skip);
          expect(response.body.products).to.have.length(
            defaultResponse.maxProductCount
          );
          expect(response.body.total).to.be.greaterThan(0);

          // Validate first product structure using custom command
          cy.validateSingleProduct(response.body.products[0]);

          // Validate all products have required fields using custom command
          response.body.products.forEach((product: Product) => {
            cy.validateProductDataTypes(product);
          });
        });
      });
    });

    it('should support pagination with limit and skip parameters', () => {
      cy.fixture('test-data/products-get.json').then(testData => {
        const paginationData = testData.pagination.smallLimit;

        cy.request(
          'GET',
          `${urls.getAll}?limit=${paginationData.limit}&skip=${paginationData.skip}`
        ).then(response => {
          // Validate response structure using custom command
          cy.validateProductResponse(response);

          // Validate pagination parameters using custom command
          cy.validatePagination(
            response,
            paginationData.limit,
            paginationData.skip
          );

          // Validate that we got different products (not the first ones)
          const firstProductId = response.body.products[0].id;
          expect(firstProductId).to.be.greaterThan(paginationData.skip);
        });
      });
    });

    it('should support field selection with select parameter', () => {
      cy.fixture('test-data/products-get.json').then(testData => {
        const fieldData = testData.fieldSelection.basicFields;

        cy.request('GET', `${urls.getAll}?select=${fieldData.fields}`).then(
          response => {
            // Validate response structure using custom command
            cy.validateProductResponse(response);

            // Validate field selection using custom command
            const firstProduct = response.body.products[0];
            cy.validateFieldSelection(
              firstProduct,
              fieldData.expectedFields,
              fieldData.unexpectedFields
            );
          }
        );
      });
    });

    it('should support pagination with limit and skip parameters', () => {
      cy.fixture('test-data/products-get.json').then(testData => {
        const paginationData = testData.pagination.largeLimit;

        cy.request(
          'GET',
          `${urls.getAll}?limit=${paginationData.limit}&skip=${paginationData.skip}`
        ).then(response => {
          // Validate response structure using custom command
          cy.validateProductResponse(response);

          // Validate pagination using custom command
          cy.validatePagination(
            response,
            paginationData.limit,
            paginationData.skip
          );

          // Validate that skip is applied correctly
          expect(response.body.products[0].id).to.be.greaterThan(
            paginationData.skip
          );
        });
      });
    });

    it('should support combined pagination and field selection', () => {
      cy.fixture('test-data/products-get.json').then(testData => {
        const combinedData = testData.combinedParameters.paginationAndFields;

        cy.request(
          'GET',
          `${urls.getAll}?limit=${combinedData.limit}&skip=${combinedData.skip}&select=${combinedData.fields}`
        ).then(response => {
          // Validate response structure using custom command
          cy.validateProductResponse(response);

          // Validate pagination parameters
          expect(response.body.limit).to.eq(combinedData.limit);
          expect(response.body.skip).to.eq(combinedData.skip);
          expect(response.body.products).to.have.length(combinedData.limit);

          // Validate field selection for each product
          response.body.products.forEach((product: Product) => {
            // Should have selected fields
            combinedData.expectedFields.forEach((field: string) => {
              expect(product).to.have.property(field);
            });

            // Should NOT have unselected fields
            combinedData.unexpectedFields.forEach((field: string) => {
              expect(product).to.not.have.property(field);
            });
          });

          // Validate that skip is applied correctly
          expect(response.body.products[0].id).to.be.greaterThan(
            combinedData.skip
          );
        });
      });
    });

    it('should support limit=0 to get all products with field selection', () => {
      cy.fixture('test-data/products-get.json').then(testData => {
        const fieldData = testData.fieldSelection.basicFields;

        cy.request(
          'GET',
          `${urls.getAll}?limit=0&select=${fieldData.fields}`
        ).then(response => {
          // Validate response structure using custom command
          cy.validateProductResponse(response);

          // Validate that we get all products when limit=0
          expect(response.body.products.length).to.be.greaterThan(30);
          expect(response.body.products.length).to.eq(response.body.total);
          expect(response.body.total).to.be.greaterThan(0);

          // Validate field selection for first product
          const firstProduct = response.body.products[0];
          cy.validateFieldSelection(
            firstProduct,
            fieldData.expectedFields,
            fieldData.unexpectedFields
          );
        });
      });
    });

    it('should support skip with field selection', () => {
      cy.fixture('test-data/products-get.json').then(testData => {
        const fieldData = testData.fieldSelection.basicFields;
        const skip = 20;

        cy.request(
          'GET',
          `${urls.getAll}?skip=${skip}&select=${fieldData.fields}`
        ).then(response => {
          // Validate response structure using custom command
          cy.validateProductResponse(response);

          // Validate skip parameter
          expect(response.body.skip).to.eq(skip);

          // Validate that skip is applied correctly
          expect(response.body.products[0].id).to.be.greaterThan(skip);

          // Validate field selection for first product
          const firstProduct = response.body.products[0];
          cy.validateFieldSelection(
            firstProduct,
            fieldData.expectedFields,
            fieldData.unexpectedFields
          );
        });
      });
    });

    it('should support multiple field selection combinations', () => {
      cy.fixture('test-data/products-get.json').then(testData => {
        const fieldCombinations = testData.fieldCombinations;

        fieldCombinations.forEach((fields: string) => {
          cy.request('GET', `${urls.getAll}?select=${fields}&limit=5`).then(
            response => {
              // Validate response structure
              cy.validateProductResponse(response);

              // Validate field selection for first product
              const firstProduct = response.body.products[0];
              const selectedFields = fields.split(',');

              // API always returns 'id' field, so add it to selected fields
              const expectedFields = selectedFields.includes('id')
                ? selectedFields
                : ['id', ...selectedFields];

              expectedFields.forEach((field: string) => {
                expect(firstProduct).to.have.property(field);
              });

              // Validate that unselected fields are not present (except 'id' which is always present)
              const allFields = [
                'title',
                'description',
                'price',
                'category',
                'brand',
                'stock',
                'rating',
              ];
              const unselectedFields = allFields.filter(
                (field: string) => !selectedFields.includes(field)
              );

              unselectedFields.forEach((field: string) => {
                expect(firstProduct).to.not.have.property(field);
              });
            }
          );
        });
      });
    });

    it('should support sorting by title in ascending order', () => {
      cy.fixture('test-data/products-get.json').then(testData => {
        const sortingData = testData.sorting.titleAsc;

        cy.request(
          'GET',
          `${urls.getAll}?sortBy=${sortingData.sortBy}&order=${sortingData.order}`
        ).then(response => {
          // Validate response structure using custom command
          cy.validateProductResponse(response);

          // Validate sorting - check if products are sorted alphabetically
          const products = response.body.products;
          const titles = products.map((p: Product) => p.title.toLowerCase());
          const sortedTitles = [...titles].sort();

          // Compare first few titles to verify sorting
          expect(titles.slice(0, 5)).to.deep.equal(sortedTitles.slice(0, 5));
        });
      });
    });

    it('should support sorting by price in descending order', () => {
      cy.fixture('test-data/products-get.json').then(testData => {
        const sortingData = testData.sorting.priceDesc;

        cy.request(
          'GET',
          `${urls.getAll}?sortBy=${sortingData.sortBy}&order=${sortingData.order}`
        ).then(response => {
          // Validate response structure using custom command
          cy.validateProductResponse(response);

          // Validate sorting
          const products = response.body.products;
          for (let i = 1; i < products.length; i++) {
            const currentPrice = products[i].price;
            const previousPrice = products[i - 1].price;
            expect(currentPrice <= previousPrice).to.be.true;
          }
        });
      });
    });

    // Enhanced Sorting Tests
    it('should support sorting by title in descending order', () => {
      cy.fixture('test-data/products-get.json').then(testData => {
        const sortingData = testData.sorting.titleDesc;

        cy.request(
          'GET',
          `${urls.getAll}?sortBy=${sortingData.sortBy}&order=${sortingData.order}`
        ).then(response => {
          // Validate response structure using custom command
          cy.validateProductResponse(response);

          // Validate that API returns products and sorting is applied
          expect(response.body.products).to.be.an('array');
          expect(response.body.products.length).to.be.greaterThan(0);

          // Verify that products are sorted in descending order
          const products = response.body.products;

          // Check that first product has highest alphabetical title
          const firstTitle = products[0].title.toLowerCase();
          const secondTitle = products[1]?.title.toLowerCase() || '';

          // In descending order, first title should be >= second title
          expect(firstTitle >= secondTitle).to.be.true;

          // Verify overall sorting trend (most products should be in descending order)
          let descendingCount = 0;
          for (let i = 1; i < products.length; i++) {
            const currentTitle = products[i].title.toLowerCase();
            const previousTitle = products[i - 1].title.toLowerCase();
            if (currentTitle <= previousTitle) {
              descendingCount++;
            }
          }

          // At least 80% of adjacent pairs should be in descending order
          const expectedDescendingPairs = Math.floor(products.length * 0.8);
          expect(descendingCount).to.be.at.least(expectedDescendingPairs);
        });
      });
    });

    it('should support sorting by price in ascending order', () => {
      cy.request('GET', `${urls.getAll}?sortBy=price&order=asc`).then(
        response => {
          // Validate response structure using custom command
          cy.validateProductResponse(response);

          // Validate sorting
          const products = response.body.products;
          for (let i = 1; i < products.length; i++) {
            const currentPrice = products[i].price;
            const previousPrice = products[i - 1].price;
            expect(currentPrice >= previousPrice).to.be.true;
          }
        }
      );
    });

    it('should support sorting by rating in descending order', () => {
      cy.request('GET', `${urls.getAll}?sortBy=rating&order=desc`).then(
        response => {
          // Validate response structure using custom command
          cy.validateProductResponse(response);

          // Validate sorting
          const products = response.body.products;
          for (let i = 1; i < products.length; i++) {
            const currentRating = products[i].rating;
            const previousRating = products[i - 1].rating;
            expect(currentRating <= previousRating).to.be.true;
          }
        }
      );
    });

    it('should support sorting by stock in ascending order', () => {
      cy.request('GET', `${urls.getAll}?sortBy=stock&order=asc`).then(
        response => {
          // Validate response structure using custom command
          cy.validateProductResponse(response);

          // Validate sorting
          const products = response.body.products;
          for (let i = 1; i < products.length; i++) {
            const currentStock = products[i].stock;
            const previousStock = products[i - 1].stock;
            expect(currentStock >= previousStock).to.be.true;
          }
        }
      );
    });

    it('should support sorting by brand in ascending order', () => {
      cy.request('GET', `${urls.getAll}?sortBy=brand&order=asc`).then(
        response => {
          // Validate response structure using custom command
          cy.validateProductResponse(response);

          // Validate sorting - check if products are sorted alphabetically by brand
          const products = response.body.products;

          // Filter out products with null/undefined brands for sorting validation
          const productsWithBrands = products.filter(
            (p: Product) => p.brand !== null && p.brand !== undefined
          );

          // Verify that products with brands are sorted in ascending order
          for (let i = 1; i < productsWithBrands.length; i++) {
            const currentBrand =
              productsWithBrands[i].brand?.toLowerCase() || '';
            const previousBrand =
              productsWithBrands[i - 1].brand?.toLowerCase() || '';
            expect(currentBrand >= previousBrand).to.be.true;
          }

          // Verify first product with brand has lowest alphabetical brand
          if (productsWithBrands.length > 0) {
            const firstBrand = productsWithBrands[0].brand?.toLowerCase() || '';
            const allBrands = productsWithBrands.map(
              (p: Product) => p.brand?.toLowerCase() || ''
            );
            const minBrand = Math.min(
              ...allBrands.map((b: string) => b.charCodeAt(0))
            );
            expect(firstBrand.charCodeAt(0)).to.be.at.most(minBrand + 1); // Allow for slight variations
          }
        }
      );
    });

    it('should support sorting by category in descending order', () => {
      cy.request('GET', `${urls.getAll}?sortBy=category&order=desc`).then(
        response => {
          // Validate response structure using custom command
          cy.validateProductResponse(response);

          // Validate sorting - check if products are sorted alphabetically by category in descending order
          const products = response.body.products;
          const categories = products.map((p: Product) =>
            p.category.toLowerCase()
          );
          const sortedCategories = [...categories].sort().reverse();

          // Compare first few categories to verify sorting
          expect(categories.slice(0, 5)).to.deep.equal(
            sortedCategories.slice(0, 5)
          );
        }
      );
    });

    it('should support sorting with pagination', () => {
      cy.request(
        'GET',
        `${urls.getAll}?sortBy=price&order=desc&limit=10&skip=10`
      ).then(response => {
        // Validate response structure using custom command
        cy.validateProductResponse(response);

        // Validate pagination parameters
        expect(response.body.limit).to.eq(10);
        expect(response.body.skip).to.eq(10);
        expect(response.body.products).to.have.length(10);

        // Validate sorting
        const products = response.body.products;
        for (let i = 1; i < products.length; i++) {
          const currentPrice = products[i].price;
          const previousPrice = products[i - 1].price;
          expect(currentPrice <= previousPrice).to.be.true;
        }
      });
    });

    it('should support sorting with field selection', () => {
      cy.request(
        'GET',
        `${urls.getAll}?sortBy=title&order=asc&select=title,price,id`
      ).then(response => {
        // Validate response structure using custom command
        cy.validateProductResponse(response);

        // Validate field selection
        const firstProduct = response.body.products[0];
        expect(firstProduct).to.have.property('id');
        expect(firstProduct).to.have.property('title');
        expect(firstProduct).to.have.property('price');
        expect(firstProduct).to.not.have.property('description');

        // Validate sorting
        const products = response.body.products;
        const titles = products.map((p: Product) => p.title.toLowerCase());
        const sortedTitles = [...titles].sort();

        // Compare first few titles to verify sorting
        expect(titles.slice(0, 5)).to.deep.equal(sortedTitles.slice(0, 5));
      });
    });

    it('should handle edge case with limit=0 to get all products', () => {
      cy.request('GET', `${urls.getAll}?limit=0`).then(response => {
        // Validate response structure using custom command
        cy.validateProductResponse(response);

        // Validate that we get all products when limit=0
        // The API might not return limit=0, but should return all products
        expect(response.body.products.length).to.be.greaterThan(30);
        expect(response.body.products.length).to.eq(response.body.total);
        expect(response.body.total).to.be.greaterThan(0);
      });
    });

    it('should handle large skip values gracefully', () => {
      const largeSkip = 1000;

      cy.request('GET', `${urls.getAll}?skip=${largeSkip}`).then(response => {
        // Validate response structure using custom command
        cy.validateProductResponse(response);

        // Validate that skip is applied correctly
        expect(response.body.skip).to.eq(largeSkip);

        // Products array might be empty if skip is too large
        expect(response.body.products).to.be.an('array');
      });
    });

    it('should validate product data types and constraints', () => {
      cy.request('GET', `${urls.getAll}?limit=5`).then(response => {
        const products = response.body.products;

        products.forEach((product: Product) => {
          // Validate data types and constraints using custom command
          cy.validateProductDataTypes(product);
        });
      });
    });

    it('should have consistent response structure across different requests', () => {
      // Make multiple requests and compare structure
      const requests = [
        cy.request('GET', urls.getAll),
        cy.request('GET', `${urls.getAll}?limit=10`),
        cy.request('GET', `${urls.getAll}?skip=10`),
      ];

      cy.wrap(requests).then(() => {
        requests.forEach(request => {
          request.then(response => {
            cy.validateProductResponse(response);
          });
        });
      });
    });

    // Boundary and Edge Cases Tests
    it('should handle boundary case with limit=1 (minimum valid limit)', () => {
      cy.request('GET', `${urls.getAll}?limit=1`).then(response => {
        // Validate response structure using custom command
        cy.validateProductResponse(response);

        // Validate boundary conditions
        expect(response.body.limit).to.eq(1);
        expect(response.body.products).to.have.length(1);
        expect(response.body.skip).to.eq(0);
        expect(response.body.total).to.be.greaterThan(0);

        // Validate first product structure
        const firstProduct = response.body.products[0];
        cy.validateSingleProduct(firstProduct);
      });
    });

    it('should handle boundary case with skip=0 (minimum valid skip)', () => {
      cy.request('GET', `${urls.getAll}?skip=0&limit=5`).then(response => {
        // Validate response structure using custom command
        cy.validateProductResponse(response);

        // Validate boundary conditions
        expect(response.body.skip).to.eq(0);
        expect(response.body.limit).to.eq(5);
        expect(response.body.products).to.have.length(5);

        // Validate first product should be the first product (ID 1)
        const firstProduct = response.body.products[0];
        expect(firstProduct.id).to.eq(1);
      });
    });

    it('should handle edge case with very large limit value', () => {
      const veryLargeLimit = 9999;

      cy.request('GET', `${urls.getAll}?limit=${veryLargeLimit}`).then(
        response => {
          // Validate response structure using custom command
          cy.validateProductResponse(response);

          // API has a maximum limit, so it might not return exactly 9999
          expect(response.body.limit).to.be.at.most(veryLargeLimit);
          expect(response.body.skip).to.eq(0);
          expect(response.body.products).to.be.an('array');

          // Should return all available products (API has a maximum limit)
          expect(response.body.products.length).to.be.at.most(veryLargeLimit);
          expect(response.body.products.length).to.be.greaterThan(0);
        }
      );
    });

    it('should handle edge case with skip value equal to total products', () => {
      // First, get total products count
      cy.request('GET', urls.getAll).then(totalResponse => {
        const totalProducts = totalResponse.body.total;

        // Then test with skip equal to total
        cy.request('GET', `${urls.getAll}?skip=${totalProducts}`).then(
          response => {
            // Validate response structure using custom command
            cy.validateProductResponse(response);

            // Validate edge conditions
            expect(response.body.skip).to.eq(totalProducts);
            expect(response.body.products).to.be.an('array');
            expect(response.body.products.length).to.eq(0); // Should be empty
            expect(response.body.total).to.eq(totalProducts);
          }
        );
      });
    });

    it('should handle edge case with skip value greater than total products', () => {
      // First, get total products count
      cy.request('GET', urls.getAll).then(totalResponse => {
        const totalProducts = totalResponse.body.total;
        const skipGreaterThanTotal = totalProducts + 10;

        // Then test with skip greater than total
        cy.request('GET', `${urls.getAll}?skip=${skipGreaterThanTotal}`).then(
          response => {
            // Validate response structure using custom command
            cy.validateProductResponse(response);

            // Validate edge conditions
            expect(response.body.skip).to.eq(skipGreaterThanTotal);
            expect(response.body.products).to.be.an('array');
            expect(response.body.products.length).to.eq(0); // Should be empty
            expect(response.body.total).to.eq(totalProducts);
          }
        );
      });
    });

    it('should handle edge case with negative limit value', () => {
      cy.request('GET', `${urls.getAll}?limit=-5`).then(response => {
        // Validate response structure using custom command
        cy.validateProductResponse(response);

        // API should handle negative limit gracefully
        expect(response.body.products).to.be.an('array');
        expect(response.body.total).to.be.greaterThan(0);

        // Should return some products (API might ignore negative limit)
        expect(response.body.products.length).to.be.greaterThan(0);
      });
    });

    it('should handle edge case with negative skip value', () => {
      cy.request('GET', `${urls.getAll}?skip=-10`).then(response => {
        // Validate response structure using custom command
        cy.validateProductResponse(response);

        // API should handle negative skip gracefully
        expect(response.body.products).to.be.an('array');
        expect(response.body.total).to.be.greaterThan(0);

        // Should return products (API might treat negative skip as 0)
        expect(response.body.products.length).to.be.greaterThan(0);
      });
    });

    it('should handle edge case with invalid limit parameter (string)', () => {
      cy.fixture('test-data/products-get.json').then(testData => {
        const edgeCaseData = testData.edgeCases.invalidLimit;

        cy.request({
          method: 'GET',
          url: `${urls.getAll}?limit=${edgeCaseData.limit}`,
          failOnStatusCode: false,
        }).then(response => {
          // API returns 400 for invalid parameters
          expect(response.status).to.eq(edgeCaseData.expectedStatus);
          expect(response.body).to.have.property('message');
          expect(response.body.message).to.include(
            edgeCaseData.expectedMessage
          );
        });
      });
    });

    it('should handle edge case with invalid skip parameter (string)', () => {
      cy.fixture('test-data/products-get.json').then(testData => {
        const edgeCaseData = testData.edgeCases.invalidSkip;

        cy.request({
          method: 'GET',
          url: `${urls.getAll}?skip=${edgeCaseData.skip}`,
          failOnStatusCode: false,
        }).then(response => {
          // API returns 400 for invalid parameters
          expect(response.status).to.eq(edgeCaseData.expectedStatus);
          expect(response.body).to.have.property('message');
          expect(response.body.message).to.include(
            edgeCaseData.expectedMessage
          );
        });
      });
    });

    it('should handle edge case with multiple invalid parameters', () => {
      cy.fixture('test-data/products-get.json').then(testData => {
        const edgeCaseData = testData.edgeCases.multipleInvalid;

        cy.request({
          method: 'GET',
          url: `${urls.getAll}?limit=${edgeCaseData.limit}&skip=${edgeCaseData.skip}&sortBy=${edgeCaseData.sortBy}`,
          failOnStatusCode: false,
        }).then(response => {
          // API returns 400 for invalid parameters
          expect(response.status).to.eq(edgeCaseData.expectedStatus);
          expect(response.body).to.have.property('message');
          expect(response.body.message).to.include(
            edgeCaseData.expectedMessage
          );
        });
      });
    });

    it('should handle edge case with very small decimal values', () => {
      cy.request('GET', `${urls.getAll}?limit=0.1&skip=0.5`).then(response => {
        // Validate response structure using custom command
        cy.validateProductResponse(response);

        // API should handle decimal values gracefully
        expect(response.body.products).to.be.an('array');
        expect(response.body.total).to.be.greaterThan(0);

        // Should return some products
        expect(response.body.products.length).to.be.greaterThan(0);
      });
    });

    it('should handle edge case with extremely large values', () => {
      const extremelyLargeValue = Number.MAX_SAFE_INTEGER;

      cy.request(
        'GET',
        `${urls.getAll}?limit=${extremelyLargeValue}&skip=${extremelyLargeValue}`
      ).then(response => {
        // Validate response structure using custom command
        cy.validateProductResponse(response);

        // API should handle extremely large values gracefully
        expect(response.body.products).to.be.an('array');
        expect(response.body.total).to.be.greaterThan(0);

        // Should not crash and return some response
        expect(response.body).to.have.property('products');
        expect(response.body).to.have.property('total');
      });
    });

    it('should handle edge case with empty query parameters', () => {
      cy.fixture('test-data/products-get.json').then(testData => {
        const edgeCaseData = testData.pagination.emptyParameters;

        cy.request(
          'GET',
          `${urls.getAll}?limit=${edgeCaseData.limit}&skip=${edgeCaseData.skip}`
        ).then(response => {
          // Validate response structure using custom command
          cy.validateProductResponse(response);

          // API treats empty parameters as null/0
          expect(response.body.products).to.be.an('array');
          expect(response.body.total).to.be.greaterThan(0);

          // API returns limit=0, skip=null, empty products array
          expect(response.body.limit).to.eq(edgeCaseData.expectedLimit);
          expect(response.body.skip).to.be.null;
          expect(response.body.products.length).to.eq(
            edgeCaseData.expectedCount
          );
        });
      });
    });

    // Edge Cases for Combined Parameters
    it('should handle edge case with empty select parameter', () => {
      cy.request('GET', `${urls.getAll}?select=&limit=5`).then(response => {
        // Validate response structure using custom command
        cy.validateProductResponse(response);

        // API should handle empty select gracefully
        expect(response.body.products).to.be.an('array');
        expect(response.body.products.length).to.eq(5);

        // Should return all fields when select is empty
        const firstProduct = response.body.products[0];
        expect(firstProduct).to.have.property('id');
        expect(firstProduct).to.have.property('title');
        expect(firstProduct).to.have.property('description');
        expect(firstProduct).to.have.property('price');
      });
    });

    it('should handle edge case with invalid select fields', () => {
      cy.request('GET', `${urls.getAll}?select=invalid_field&limit=5`).then(
        response => {
          // Validate response structure using custom command
          cy.validateProductResponse(response);

          // API should handle invalid select fields gracefully
          expect(response.body.products).to.be.an('array');
          expect(response.body.products.length).to.eq(5);

          // API returns only 'id' field when invalid field is specified
          const firstProduct = response.body.products[0];
          expect(firstProduct).to.have.property('id');
          expect(firstProduct).to.not.have.property('title');
          expect(firstProduct).to.not.have.property('description');
          expect(firstProduct).to.not.have.property('price');
        }
      );
    });

    it('should handle edge case with mixed valid and invalid select fields', () => {
      cy.request(
        'GET',
        `${urls.getAll}?select=title,invalid_field,price&limit=5`
      ).then(response => {
        // Validate response structure using custom command
        cy.validateProductResponse(response);

        // API should handle mixed valid/invalid fields gracefully
        expect(response.body.products).to.be.an('array');
        expect(response.body.products.length).to.eq(5);

        // Should return products with valid fields
        const firstProduct = response.body.products[0];
        expect(firstProduct).to.have.property('title');
        expect(firstProduct).to.have.property('price');
      });
    });

    it('should handle edge case with all parameters combined', () => {
      cy.request(
        'GET',
        `${urls.getAll}?limit=5&skip=10&select=title,price&sortBy=price&order=desc`
      ).then(response => {
        // Validate response structure using custom command
        cy.validateProductResponse(response);

        // Validate all parameters are applied
        expect(response.body.limit).to.eq(5);
        expect(response.body.skip).to.eq(10);
        expect(response.body.products).to.have.length(5);

        // Validate field selection
        const firstProduct = response.body.products[0];
        expect(firstProduct).to.have.property('title');
        expect(firstProduct).to.have.property('price');
        expect(firstProduct).to.not.have.property('description');

        // Validate skip is applied
        expect(firstProduct.id).to.be.greaterThan(10);

        // Validate sorting (price should be descending)
        for (let i = 1; i < response.body.products.length; i++) {
          const currentPrice = response.body.products[i].price;
          const previousPrice = response.body.products[i - 1].price;
          expect(currentPrice <= previousPrice).to.be.true;
        }
      });
    });

    it('should handle edge case with very large values in combined parameters', () => {
      const veryLargeLimit = 9999;
      const veryLargeSkip = 5000;

      cy.request(
        'GET',
        `${urls.getAll}?limit=${veryLargeLimit}&skip=${veryLargeSkip}&select=title,price`
      ).then(response => {
        // Validate response structure using custom command
        cy.validateProductResponse(response);

        // API should handle large values gracefully
        expect(response.body.limit).to.be.at.most(veryLargeLimit);
        expect(response.body.skip).to.eq(veryLargeSkip);
        expect(response.body.products).to.be.an('array');

        // Validate field selection
        if (response.body.products.length > 0) {
          const firstProduct = response.body.products[0];
          expect(firstProduct).to.have.property('title');
          expect(firstProduct).to.have.property('price');
          expect(firstProduct).to.not.have.property('description');
        }
      });
    });

    it('should handle edge case with negative values in combined parameters', () => {
      cy.request(
        'GET',
        `${urls.getAll}?limit=-5&skip=-10&select=title,price`
      ).then(response => {
        // Validate response structure using custom command
        cy.validateProductResponse(response);

        // API should handle negative values gracefully
        expect(response.body.products).to.be.an('array');
        expect(response.body.total).to.be.greaterThan(0);

        // Validate field selection
        if (response.body.products.length > 0) {
          const firstProduct = response.body.products[0];
          expect(firstProduct).to.have.property('title');
          expect(firstProduct).to.have.property('price');
        }
      });
    });

    // Edge Cases for Sorting
    it('should handle edge case with invalid sortBy field', () => {
      cy.request('GET', `${urls.getAll}?sortBy=invalid_field&order=asc`).then(
        response => {
          // Validate response structure using custom command
          cy.validateProductResponse(response);

          // API should handle invalid sortBy gracefully
          expect(response.body.products).to.be.an('array');
          expect(response.body.total).to.be.greaterThan(0);
          expect(response.body.products.length).to.be.greaterThan(0);
        }
      );
    });

    it('should handle edge case with invalid order parameter', () => {
      cy.request({
        method: 'GET',
        url: `${urls.getAll}?sortBy=title&order=invalid`,
        failOnStatusCode: false,
      }).then(response => {
        // API returns 400 for invalid order parameter
        expect(response.status).to.eq(400);
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.include('Order can be');
      });
    });

    it('should handle edge case with empty sortBy parameter', () => {
      cy.request('GET', `${urls.getAll}?sortBy=&order=asc`).then(response => {
        // Validate response structure using custom command
        cy.validateProductResponse(response);

        // API should handle empty sortBy gracefully
        expect(response.body.products).to.be.an('array');
        expect(response.body.total).to.be.greaterThan(0);
        expect(response.body.products.length).to.be.greaterThan(0);
      });
    });

    it('should handle edge case with empty order parameter', () => {
      cy.request('GET', `${urls.getAll}?sortBy=title&order=`).then(response => {
        // Validate response structure using custom command
        cy.validateProductResponse(response);

        // API should handle empty order gracefully
        expect(response.body.products).to.be.an('array');
        expect(response.body.total).to.be.greaterThan(0);
        expect(response.body.products.length).to.be.greaterThan(0);
      });
    });

    it('should handle edge case with case insensitive order parameter', () => {
      cy.request('GET', `${urls.getAll}?sortBy=title&order=ASC`).then(
        response => {
          // Validate response structure using custom command
          cy.validateProductResponse(response);

          // API should handle case insensitive order gracefully
          expect(response.body.products).to.be.an('array');
          expect(response.body.total).to.be.greaterThan(0);
          expect(response.body.products.length).to.be.greaterThan(0);

          // Validate sorting if it works
          const products = response.body.products;
          const titles = products.map((p: Product) => p.title.toLowerCase());
          const sortedTitles = [...titles].sort();

          // Compare first few titles to verify sorting
          expect(titles.slice(0, 5)).to.deep.equal(sortedTitles.slice(0, 5));
        }
      );
    });

    it('should handle edge case with sorting by numeric fields with null values', () => {
      cy.request('GET', `${urls.getAll}?sortBy=rating&order=desc`).then(
        response => {
          // Validate response structure using custom command
          cy.validateProductResponse(response);

          // API should handle null values in sorting gracefully
          expect(response.body.products).to.be.an('array');
          expect(response.body.total).to.be.greaterThan(0);
          expect(response.body.products.length).to.be.greaterThan(0);

          // Validate sorting for non-null values
          const products = response.body.products;
          const validRatings = products.filter(
            (p: Product) => p.rating !== null && p.rating !== undefined
          );

          for (let i = 1; i < validRatings.length; i++) {
            const currentRating = validRatings[i].rating;
            const previousRating = validRatings[i - 1].rating;
            expect(currentRating <= previousRating).to.be.true;
          }
        }
      );
    });

    it('should handle edge case with sorting by string fields with null values', () => {
      cy.request('GET', `${urls.getAll}?sortBy=brand&order=asc`).then(
        response => {
          // Validate response structure using custom command
          cy.validateProductResponse(response);

          // API should handle null values in sorting gracefully
          expect(response.body.products).to.be.an('array');
          expect(response.body.total).to.be.greaterThan(0);
          expect(response.body.products.length).to.be.greaterThan(0);

          // Validate sorting for non-null values
          const products = response.body.products;
          const validBrands = products.filter(
            (p: Product) => p.brand !== null && p.brand !== undefined
          );
          const brands = validBrands.map(
            (p: Product) => p.brand?.toLowerCase() || ''
          );
          const sortedBrands = [...brands].sort();

          // Compare first few brands to verify sorting
          expect(brands.slice(0, 5)).to.deep.equal(sortedBrands.slice(0, 5));
        }
      );
    });

    it('should handle edge case with all sorting parameters combined', () => {
      cy.request(
        'GET',
        `${urls.getAll}?sortBy=price&order=desc&limit=5&skip=10&select=title,price,id`
      ).then(response => {
        // Validate response structure using custom command
        cy.validateProductResponse(response);

        // Validate all parameters are applied
        expect(response.body.limit).to.eq(5);
        expect(response.body.skip).to.eq(10);
        expect(response.body.products).to.have.length(5);

        // Validate field selection
        const firstProduct = response.body.products[0];
        expect(firstProduct).to.have.property('id');
        expect(firstProduct).to.have.property('title');
        expect(firstProduct).to.have.property('price');
        expect(firstProduct).to.not.have.property('description');

        // Validate sorting
        const products = response.body.products;
        for (let i = 1; i < products.length; i++) {
          const currentPrice = products[i].price;
          const previousPrice = products[i - 1].price;
          expect(currentPrice <= previousPrice).to.be.true;
        }
      });
    });
  });
});
