# Things to Do

1. **Update Packages and Check Audit Results**  
   Many package versions are outdated. Running `npm audit` shows numerous security vulnerabilities. These packages need to be updated.  
   Consider configuring something like **Dependabot** to automatically keep packages up to date.

2. **Simplify Form Handling**  
   Consider using libraries like **React Hook Form** or existing form libraries to avoid the overhead of managing state manually with `useReducer`.

3. **Improve Tests**  
   Test coverage needs to be improved.
   Currently, several tests — especially those from a user’s perspective are intentionally left out.

4. **Complete Translations**  
   Some sections are still not translated.  
   Ensure all UI text supports **internationalization (i18n)**.

5. **Make the UI Responsive**  
   The UI should adapt properly across devices of various screen sizes.

6. **Modularize Reusable Components**  
   Extract reusable UI components into a separate directory (e.g., `ui-lib`) and write dedicated test for them.  
   Example: `SortableTable` and other shared components.

7. **Improve code quality**  
   Improve code quality by keeping the UI component layer as lean as possible. Utilize more hooks for handling concerns and write cleaner, more maintainable code. Consider using React Query for data fetching to ensure the UI state stays in sync with the server state, caching ..etc

8. **Improve Routing and Implement Lazy Loading**  
   Enhance the routing architecture by ensuring dynamic imports and lazy loading of components using React.lazy()

# Note :

- **"He's just a little shy"** - `feature`

  - The page "Top Secret" contains some highly confidential information. It should only be available to admin users. Hide the corresponding navigation item if a user is not an admin. Prevent all navigation to the corresponding route and show the user a hint that he is not allowed to access it.

This feature is implemented in such a way that the user ID needs to be provided through the URL parameters in order to see the "Top Secret" navigation item and access the page. The implementation takes the user ID from the URL parameters, makes a request, fetches the access role, and shows the page based on that. The URL parameters are used to simplify the approach. Ideally, user details should be obtained from the logged-in user, and the route will be displayed depending on that user data.

eg:- http://localhost:5174/invoices?userId=5
