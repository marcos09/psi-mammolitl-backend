# Comprehensive Testing Guide

This project now includes extensive test coverage across all layers of the application. This document provides an overview of the testing strategy and how to run the tests.

## Test Structure

### 1. Unit Tests
- **Location**: `src/**/*.spec.ts`
- **Purpose**: Test individual services, controllers, and DTOs in isolation
- **Coverage**: All business logic, validation, and error handling

#### Service Tests
- `psychologist.service.spec.ts` - Tests for psychologist management
- `booking.service.spec.ts` - Tests for booking workflow and validation
- `timeslot.service.spec.ts` - Tests for time slot management
- `appointment-type.service.spec.ts` - Tests for appointment type operations
- `specialization.service.spec.ts` - Tests for specialization management
- `user.service.spec.ts` - Tests for user operations

#### Controller Tests
- `psychologist.controller.spec.ts` - API endpoint tests for psychologists
- `booking.controller.spec.ts` - API endpoint tests for bookings
- `timeslot.controller.spec.ts` - API endpoint tests for time slots
- `appointment-type.controller.spec.ts` - API endpoint tests for appointment types
- `specialization.controller.spec.ts` - API endpoint tests for specializations

#### DTO Validation Tests
- `booking.dto.spec.ts` - Validation tests for booking DTOs
- `timeslot.dto.spec.ts` - Validation tests for time slot DTOs
- `appointment-type.dto.spec.ts` - Validation tests for appointment type DTOs
- `psychologist.dto.spec.ts` - Validation tests for psychologist DTOs
- `specialization.dto.spec.ts` - Validation tests for specialization DTOs

### 2. Integration Tests
- **Location**: `src/integration/`
- **Purpose**: Test complete workflows and service interactions
- **Coverage**: End-to-end business processes

#### Workflow Tests
- `booking-workflow.integration.spec.ts` - Complete booking workflow from creation to completion

### 3. Entity Relationship Tests
- **Location**: `src/entities/entity-relationships.spec.ts`
- **Purpose**: Test database relationships and constraints
- **Coverage**: Entity associations, cascading operations, and data integrity

### 4. End-to-End Tests
- **Location**: `test/`
- **Purpose**: Test complete user journeys through the API
- **Coverage**: Critical user workflows and API integration

#### E2E Test Files
- `app.e2e-spec.ts` - Basic application health check
- `booking-e2e.spec.ts` - Complete booking user journey

## Test Configuration

### Jest Configuration
- **Main Config**: `jest.config.js`
- **Package.json**: Updated with comprehensive Jest settings
- **Setup**: `test/setup.ts` for global test configuration

### Coverage Requirements
- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%
- **Statements**: 80%

## Running Tests

### Individual Test Suites
```bash
# Run all unit tests
npm run test:unit

# Run service tests only
npm run test:services

# Run controller tests only
npm run test:controllers

# Run DTO validation tests only
npm run test:dto

# Run integration tests only
npm run test:integration

# Run entity relationship tests only
npm run test:entities

# Run end-to-end tests only
npm run test:e2e
```

### Comprehensive Test Runs
```bash
# Run all tests with coverage
npm run test:cov

# Run all test types (unit + integration + e2e)
npm run test:all

# Run tests for CI/CD pipeline
npm run test:ci

# Run tests in watch mode
npm run test:watch

# Run tests with debugging
npm run test:debug
```

### Development Workflow
```bash
# Run tests during development
npm run test:watch

# Run specific test file
npm test -- psychologist.service.spec.ts

# Run tests matching pattern
npm test -- --testNamePattern="should create booking"

# Run tests with coverage for specific file
npm run test:cov -- psychologist.service.spec.ts
```

## Test Categories

### 1. Service Tests
- **Mocking**: All external dependencies are mocked
- **Isolation**: Each service is tested independently
- **Coverage**: All public methods and error scenarios
- **Validation**: Business logic and data validation

### 2. Controller Tests
- **HTTP Methods**: All REST endpoints tested
- **Status Codes**: Proper HTTP responses verified
- **Request/Response**: DTO validation and transformation
- **Error Handling**: Exception scenarios covered

### 3. DTO Tests
- **Validation Rules**: All class-validator decorators tested
- **Edge Cases**: Invalid data scenarios
- **Transformation**: Data conversion and sanitization
- **Required Fields**: Mandatory field validation

### 4. Integration Tests
- **Workflows**: Complete business processes
- **Service Interaction**: Multiple services working together
- **Data Flow**: End-to-end data processing
- **Error Propagation**: Error handling across services

### 5. Entity Tests
- **Relationships**: Database associations
- **Constraints**: Data integrity rules
- **Cascading**: Delete and update operations
- **Validation**: Entity-level validation

### 6. E2E Tests
- **User Journeys**: Complete user workflows
- **API Integration**: Full HTTP request/response cycle
- **Database**: Real database operations
- **Authentication**: Security and access control

## Test Data Management

### Mock Data
- **Consistent**: Reusable test data across all tests
- **Realistic**: Data that matches production scenarios
- **Isolated**: Each test uses independent data
- **Cleanup**: Proper test data cleanup after each test

### Database Testing
- **In-Memory**: SQLite for fast unit tests
- **Isolation**: Each test gets a clean database state
- **Transactions**: Rollback for test isolation
- **Migrations**: Test database schema updates

## Best Practices

### Test Organization
- **Descriptive Names**: Clear test descriptions
- **Single Responsibility**: Each test verifies one behavior
- **Arrange-Act-Assert**: Clear test structure
- **Independent**: Tests don't depend on each other

### Mocking Strategy
- **External Dependencies**: Mock all external services
- **Database**: Use in-memory database for unit tests
- **Time**: Mock time-dependent operations
- **Random**: Mock random number generation

### Error Testing
- **Exception Scenarios**: Test all error conditions
- **Edge Cases**: Boundary value testing
- **Invalid Input**: Malformed data handling
- **Resource Limits**: Memory and performance limits

### Performance Testing
- **Response Times**: API endpoint performance
- **Database Queries**: Query optimization
- **Memory Usage**: Memory leak detection
- **Concurrent Users**: Load testing scenarios

## Continuous Integration

### GitHub Actions (Recommended)
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:ci
      - uses: codecov/codecov-action@v1
```

### Coverage Reporting
- **HTML Reports**: Detailed coverage in `coverage/` directory
- **LCOV Format**: Compatible with CI/CD tools
- **Threshold Enforcement**: Build fails if coverage below 80%
- **Trend Analysis**: Track coverage over time

## Troubleshooting

### Common Issues
1. **Database Connection**: Ensure test database is properly configured
2. **Mock Issues**: Verify all external dependencies are mocked
3. **Timeout Errors**: Increase test timeout for slow operations
4. **Memory Leaks**: Check for proper cleanup in tests

### Debug Mode
```bash
# Run specific test with debugging
npm run test:debug -- --testNamePattern="specific test"

# Run with verbose output
npm test -- --verbose

# Run single test file with debugging
npm run test:debug -- psychologist.service.spec.ts
```

## Test Maintenance

### Regular Updates
- **New Features**: Add tests for new functionality
- **Bug Fixes**: Add regression tests
- **Refactoring**: Update tests when code changes
- **Dependencies**: Update test dependencies regularly

### Code Coverage
- **Monitor**: Track coverage trends
- **Improve**: Add tests for uncovered code
- **Maintain**: Keep coverage above 80%
- **Review**: Regular coverage report reviews

This comprehensive testing setup ensures high code quality, reliability, and maintainability of the PSI Mammoliti Backend application.
