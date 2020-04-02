# PubMed-challenge

##### Note:
This is a React web app. Also install and start the companion PubMed Flask Server.

<br/>

Key features implemented: 
- A text box that allows the user to enter query terms
- A button labeled “Search” that executes the search when clicked
- A results display that includes the following for each result:
  - Publication date
  - Last Author
  - Article Title (as a live link to the pubmed entry, e.g. https://www.ncbi.nlm.nih.gov/pubmed/20008181)
- Sortable columns (Relavance, First Author, Publication date)
- Paging of large result set
- User specified date range
- Abstract displayed in popup when mouse hovers over headline
- Search keywords highlighted in the results 

## Setup:

#### Download npm (v3.5+) / Node.js (v8.10+)

Get npm/node.js from: https://www.npmjs.com/get-npm

#### Install dependencies and start web app

```
$ npm install

$ npm start
```

The project will build and kickoff a Node.js server to host the React.js web application. A browser window will automatically open in your default browser pointing to http://localhost:3000.
