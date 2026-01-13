export interface SearchFilters {
  query: string;
  authors?: string[];
  categories?: string[];
  status?: string[];
  minRating?: number;
  maxRating?: number;
  minPages?: number;
  maxPages?: number;
  dateFrom?: string;
  dateTo?: string;
}

export function buildSearchQuery(filters: SearchFilters) {
  const conditions: string[] = [];
  
  if (filters.query) {
    conditions.push(`query:${filters.query}`);
  }
  
  if (filters.authors && filters.authors.length > 0) {
    conditions.push(`authors:${filters.authors.join(",")}`);
  }
  
  if (filters.categories && filters.categories.length > 0) {
    conditions.push(`categories:${filters.categories.join(",")}`);
  }
  
  if (filters.status && filters.status.length > 0) {
    conditions.push(`status:${filters.status.join(",")}`);
  }
  
  if (filters.minRating) {
    conditions.push(`minRating:${filters.minRating}`);
  }
  
  if (filters.maxRating) {
    conditions.push(`maxRating:${filters.maxRating}`);
  }
  
  if (filters.minPages) {
    conditions.push(`minPages:${filters.minPages}`);
  }
  
  if (filters.maxPages) {
    conditions.push(`maxPages:${filters.maxPages}`);
  }
  
  return conditions.join(" AND ");
}

export function parseSearchQuery(queryString: string): SearchFilters {
  const filters: SearchFilters = { query: "" };
  const parts = queryString.split(" AND ");
  
  parts.forEach((part) => {
    const [key, value] = part.split(":");
    if (!key || !value) {
      filters.query = part;
      return;
    }
    
    switch (key) {
      case "query":
        filters.query = value;
        break;
      case "authors":
        filters.authors = value.split(",");
        break;
      case "categories":
        filters.categories = value.split(",");
        break;
      case "status":
        filters.status = value.split(",");
        break;
      case "minRating":
        filters.minRating = parseFloat(value);
        break;
      case "maxRating":
        filters.maxRating = parseFloat(value);
        break;
      case "minPages":
        filters.minPages = parseInt(value);
        break;
      case "maxPages":
        filters.maxPages = parseInt(value);
        break;
      default:
        filters.query = part;
    }
  });
  
  return filters;
}

export function searchInLibrary(library: any[], filters: SearchFilters) {
  return library.filter((item) => {
    const book = item.book;
    
    // Text search
    if (filters.query) {
      const searchText = filters.query.toLowerCase();
      const titleMatch = book.title?.toLowerCase().includes(searchText);
      const authorMatch = book.authors?.some((a: string) => 
        a.toLowerCase().includes(searchText)
      );
      if (!titleMatch && !authorMatch) return false;
    }
    
    // Author filter
    if (filters.authors && filters.authors.length > 0) {
      const hasAuthor = filters.authors.some((author) =>
        book.authors?.some((a: string) => 
          a.toLowerCase().includes(author.toLowerCase())
        )
      );
      if (!hasAuthor) return false;
    }
    
    // Category filter
    if (filters.categories && filters.categories.length > 0) {
      const hasCategory = filters.categories.some((category) =>
        book.categories?.some((c: string) => 
          c.toLowerCase().includes(category.toLowerCase())
        )
      );
      if (!hasCategory) return false;
    }
    
    // Status filter
    if (filters.status && filters.status.length > 0) {
      if (!filters.status.includes(item.status)) return false;
    }
    
    // Rating filter
    if (filters.minRating && item.personal_rating < filters.minRating) {
      return false;
    }
    if (filters.maxRating && item.personal_rating > filters.maxRating) {
      return false;
    }
    
    // Page count filter
    if (filters.minPages && book.page_count < filters.minPages) {
      return false;
    }
    if (filters.maxPages && book.page_count > filters.maxPages) {
      return false;
    }
    
    return true;
  });
}

export function searchInNotes(notes: any[], query: string) {
  const searchText = query.toLowerCase();
  return notes.filter((note) => {
    const contentMatch = note.content?.toLowerCase().includes(searchText);
    const tagMatch = note.tags?.some((tag: string) => 
      tag.toLowerCase().includes(searchText)
    );
    return contentMatch || tagMatch;
  });
}
