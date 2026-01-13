"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, X, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Debounce hook for search optimization
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

interface SearchFilters {
  title?: string;
  author?: string;
  subject?: string;
  publisher?: string;
  genre?: string;
  language?: string;
  yearRange?: string;
  sortBy?: string;
}

interface SearchBarProps {
  onSearch: (query: string, filters?: SearchFilters) => void;
  placeholder?: string;
  defaultValue?: string;
}

export function SearchBar({ onSearch, placeholder = "Search for books...", defaultValue = "" }: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Debounce the query for auto-search (300ms delay)
  const debouncedQuery = useDebounce(query, 300);

  const handleSearch = useCallback((e?: React.FormEvent) => {
    e?.preventDefault();
    setIsSearching(true);
    onSearch(query, filters);
    // Reset searching state after a brief moment
    setTimeout(() => setIsSearching(false), 200);
  }, [query, filters, onSearch]);

  // Auto-search when debounced query changes (only if not empty)
  useEffect(() => {
    if (debouncedQuery.trim()) {
      handleSearch();
    }
  }, [debouncedQuery]);

  const handleClear = useCallback(() => {
    setQuery("");
    setFilters({});
    onSearch("", {});
  }, [onSearch]);

  // Keyboard shortcut: Ctrl+K or Cmd+K to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.querySelector<HTMLInputElement>('input[type="text"]')?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="pl-10 pr-10"
          />
          {query && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
              onClick={handleClear}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <Button type="submit" className="text-primary-foreground" disabled={isSearching}>
          {isSearching ? "Searching..." : "Search"}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => setShowFilters(!showFilters)}
          className="relative"
        >
          <Filter className="h-4 w-4" />
          {activeFiltersCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -right-2 -top-2 h-5 w-5 rounded-full p-0 text-xs"
            >
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </form>

      {showFilters && (
        <div className="rounded-lg border p-4 space-y-4 bg-card">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Advanced Filters</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFilters({})}
              disabled={activeFiltersCount === 0}
            >
              Clear All
            </Button>
          </div>
          <Separator />

          {/* Quick Filters Row */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="genre-filter">Genre/Subject</Label>
              <Select
                value={filters.genre || ""}
                onValueChange={(value) => setFilters({ ...filters, genre: value })}
              >
                <SelectTrigger id="genre-filter">
                  <SelectValue placeholder="Any genre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any genre</SelectItem>
                  <SelectItem value="fiction">Fiction</SelectItem>
                  <SelectItem value="mystery">Mystery & Thriller</SelectItem>
                  <SelectItem value="romance">Romance</SelectItem>
                  <SelectItem value="science fiction">Science Fiction</SelectItem>
                  <SelectItem value="fantasy">Fantasy</SelectItem>
                  <SelectItem value="horror">Horror</SelectItem>
                  <SelectItem value="biography">Biography</SelectItem>
                  <SelectItem value="history">History</SelectItem>
                  <SelectItem value="self-help">Self-Help</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="cooking">Cooking</SelectItem>
                  <SelectItem value="science">Science</SelectItem>
                  <SelectItem value="travel">Travel</SelectItem>
                  <SelectItem value="poetry">Poetry</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="language-filter">Language</Label>
              <Select
                value={filters.language || ""}
                onValueChange={(value) => setFilters({ ...filters, language: value })}
              >
                <SelectTrigger id="language-filter">
                  <SelectValue placeholder="Any language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any language</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                  <SelectItem value="it">Italian</SelectItem>
                  <SelectItem value="pt">Portuguese</SelectItem>
                  <SelectItem value="ja">Japanese</SelectItem>
                  <SelectItem value="zh">Chinese</SelectItem>
                  <SelectItem value="ru">Russian</SelectItem>
                  <SelectItem value="ar">Arabic</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="year-filter">Publication Year</Label>
              <Select
                value={filters.yearRange || ""}
                onValueChange={(value) => setFilters({ ...filters, yearRange: value })}
              >
                <SelectTrigger id="year-filter">
                  <SelectValue placeholder="Any year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any year</SelectItem>
                  <SelectItem value="2024-">2024 onwards</SelectItem>
                  <SelectItem value="2020-2024">2020-2024</SelectItem>
                  <SelectItem value="2015-2019">2015-2019</SelectItem>
                  <SelectItem value="2010-2014">2010-2014</SelectItem>
                  <SelectItem value="2000-2009">2000-2009</SelectItem>
                  <SelectItem value="1990-1999">1990-1999</SelectItem>
                  <SelectItem value="-1989">Before 1990</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* Text Search Filters */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title-filter">Title Contains</Label>
              <Input
                id="title-filter"
                value={filters.title || ""}
                onChange={(e) => setFilters({ ...filters, title: e.target.value })}
                placeholder="Specific title keywords"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="author-filter">Author Name</Label>
              <Input
                id="author-filter"
                value={filters.author || ""}
                onChange={(e) => setFilters({ ...filters, author: e.target.value })}
                placeholder="Author's name"
              />
            </div>
          </div>

          {/* Sort Options */}
          <div className="space-y-2">
            <Label htmlFor="sort-filter">Sort Results By</Label>
            <Select
              value={filters.sortBy || "relevance"}
              onValueChange={(value) => setFilters({ ...filters, sortBy: value })}
            >
              <SelectTrigger id="sort-filter">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleSearch} className="w-full" size="lg">
            Apply Filters
          </Button>
        </div>
      )}
    </div>
  );
}
