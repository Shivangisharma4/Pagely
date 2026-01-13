interface CSVBook {
  Title: string;
  Author: string;
  ISBN?: string;
  ISBN13?: string;
  "My Rating"?: string;
  "Date Read"?: string;
  "Exclusive Shelf"?: string;
}

interface ImportResult {
  success: number;
  failed: number;
  errors: Array<{ row: number; error: string; data: any }>;
}

export function parseGoodreadsCSV(csvText: string): CSVBook[] {
  const lines = csvText.split("\n");
  const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""));
  
  const books: CSVBook[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    
    const values = parseCSVLine(lines[i]);
    const book: any = {};
    
    headers.forEach((header, index) => {
      book[header] = values[index]?.replace(/"/g, "").trim();
    });
    
    books.push(book);
  }
  
  return books;
}

function parseCSVLine(line: string): string[] {
  const values: string[] = [];
  let current = "";
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      values.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  
  values.push(current);
  return values;
}

export function matchBookByISBN(
  csvBook: CSVBook,
  existingBooks: Array<{ isbn10?: string; isbn13?: string; title: string }>
): any | null {
  const isbn13 = csvBook.ISBN13 || csvBook.ISBN;
  const isbn10 = csvBook.ISBN;
  
  if (isbn13) {
    const match = existingBooks.find((b) => b.isbn13 === isbn13);
    if (match) return match;
  }
  
  if (isbn10) {
    const match = existingBooks.find((b) => b.isbn10 === isbn10);
    if (match) return match;
  }
  
  return null;
}

export function matchBookByMetadata(
  csvBook: CSVBook,
  existingBooks: Array<{ title: string; authors?: string[] }>
): any | null {
  const title = csvBook.Title.toLowerCase();
  const author = csvBook.Author.toLowerCase();
  
  const match = existingBooks.find((b) => {
    const titleMatch = b.title.toLowerCase().includes(title) || title.includes(b.title.toLowerCase());
    const authorMatch = b.authors?.some((a) => 
      a.toLowerCase().includes(author) || author.includes(a.toLowerCase())
    );
    return titleMatch && authorMatch;
  });
  
  return match || null;
}

export function mapGoodreadsStatus(shelfName: string): string {
  const shelf = shelfName.toLowerCase();
  
  // Check currently-reading first (more specific)
  if (shelf.includes("currently")) {
    return "currently_reading";
  }
  // Check to-read/want before general "read"
  if (shelf.includes("to-read") || shelf.includes("want")) {
    return "want_to_read";
  }
  // Check finished/read last
  if (shelf.includes("read") || shelf.includes("finished")) {
    return "finished";
  }
  
  return "want_to_read";
}

export function exportToCSV(data: any[], filename: string) {
  if (data.length === 0) return;
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(","),
    ...data.map((row) =>
      headers.map((header) => {
        const value = row[header];
        if (value === null || value === undefined) return "";
        const stringValue = String(value);
        // Escape quotes and wrap in quotes if contains comma
        if (stringValue.includes(",") || stringValue.includes('"')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      }).join(",")
    ),
  ].join("\n");
  
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToJSON(data: any[], filename: string) {
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: "application/json" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function validateImportData(books: CSVBook[]): ImportResult {
  const result: ImportResult = {
    success: 0,
    failed: 0,
    errors: [],
  };
  
  books.forEach((book, index) => {
    const errors: string[] = [];
    
    if (!book.Title || book.Title.trim() === "") {
      errors.push("Missing title");
    }
    
    if (!book.Author || book.Author.trim() === "") {
      errors.push("Missing author");
    }
    
    if (book["My Rating"]) {
      const rating = parseFloat(book["My Rating"]);
      if (isNaN(rating) || rating < 0 || rating > 5) {
        errors.push("Invalid rating");
      }
    }
    
    if (errors.length > 0) {
      result.failed++;
      result.errors.push({
        row: index + 2, // +2 for header and 0-index
        error: errors.join(", "),
        data: book,
      });
    } else {
      result.success++;
    }
  });
  
  return result;
}
