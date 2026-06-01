# Post-Documentation: Implementing the Filtering Feature for Kyomei along with the struggles/comments in doing so

## Context
This doc was created to document the process of implementing the filtering feature for Kyomei, a project that I have been working on. The filtering feature allows users to filter out certain types of content from their feed, such as posts from specific users or posts containing certain keywords.

## Struggles/Comments
1. **Understanding the Requirements**: Initially, I had a hard time understanding the functionality of the filtering feature. I had think about how I wanted the filtering logic to work and how it would interact with the existing codebase. I had to spend some time researching and brainstorming to come up with a clear plan for implementing the feature.
2. **Actually implementing the Feature**: Once I had a clear plan, I started implementing the feature. This involved writing code to handle the filtering logic, as well as updating the user interface to allow users to set their filtering preferences. I encountered some challenges along the way, such as building the filteredSearchResults function, which introduced more challenges. 
3. **Understanding the React Pattern for adding and removing elements in a list**: Although I was familiar with the pattern, I had to spend some time refreshing my memory on how to properly add and remove elements from a list in React. For example, in the onFilterToggle function, I had to ensure that I was correctly updating the state of the filters array without mutating it directly by using the spread operator to create a new array with the updated filters and using higher-order functions like filter to remove elements from the array when toggling off a filter. 

## Future Improvements
1. **Updating the filtering logic**: The current implementation of the filtering logic only applies when the user has a specific search query. Consequently, if the user has no search query, the filtering logic is not applied, and the primary feed is displayed. In the future, I plan to update the filtering logic to apply even when there is no search query, ensuring that users can filter their feed regardless of whether they are searching for specific content or not. 

## Conclusion
Overall, implementing the filtering feature for Kyomei was a challenging but rewarding experience. It required me to think critically about the requirements and how to implement the feature effectively. Despite the struggles I faced, I was able to successfully implement one of the features of the MVP. This whole process of post-documenting is a new schmick that I plan to continue to reflect on my experiences and to document the challenges or insights that I encountered along the way. 