---
mode: "agent"
model: Gemini 2.5 Pro
tools: ['edit', 'search', 'new', 'upstash/context7/*']
description: "Generate a unit test file for a service"
---

Generate a **unit test** file for the ${file} service.  
The tests should cover **all possible scenarios**.

### Instructions

1. Ensure the `tests` directory exists.

    - If it doesn’t, create one (for example: ${./ticketing/ticket/src/tests}).

2. The test file name should follow this format:  
   `<serviceName>.test.ts`

3. The test file structure and style should be similar to this example:  
   ${./ticketing/ticket/src/routes/__test__/new.test.ts}

4. After generating the test file, **run all tests** and verify that they execute successfully.
