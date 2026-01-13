import type { Meta, StoryObj } from "@storybook/react";
import { BookCard } from "@/components/books/book-card";
import type { GoogleBooksVolume } from "@/types/google-books.types";

const meta = {
  title: "Components/BookCard",
  component: BookCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-[300px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof BookCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockBook: GoogleBooksVolume = {
  google_books_id: "test-id",
  isbn10: null,
  isbn13: "9781234567890",
  title: "The Great Gatsby",
  subtitle: "A Novel",
  authors: ["F. Scott Fitzgerald"],
  publisher: "Scribner",
  published_date: "1925-04-10",
  description: "The story of the mysteriously wealthy Jay Gatsby and his love for Daisy Buchanan.",
  page_count: 180,
  categories: ["Fiction", "Classics"],
  average_rating: 3.9,
  ratings_count: 3987654,
  language: "en",
  image_links: {
    thumbnail: "https://books.google.com/books/content?id=test&printsec=frontcover&img=1",
  },
};

export const Default: Story = {
  args: {
    book: mockBook,
  },
};

export const WithProgress: Story = {
  args: {
    book: {
      ...mockBook,
      user_id: "test-user",
      book_id: "test-book",
      status: "currently_reading",
      current_page: 90,
      id: "user-book-id",
      format: null,
      start_date: null,
      finish_date: null,
      personal_rating: null,
      personal_review: null,
      notes: [],
      tags: null,
      is_private: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      book: mockBook,
    },
    showProgress: true,
  },
};

export const Finished: Story = {
  args: {
    book: {
      ...mockBook,
      user_id: "test-user",
      book_id: "test-book",
      status: "finished",
      current_page: 180,
      id: "user-book-id",
      format: null,
      start_date: null,
      finish_date: new Date().toISOString().split("T")[0],
      personal_rating: 5,
      personal_review: null,
      notes: [],
      tags: null,
      is_private: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      book: mockBook,
    },
    showProgress: true,
  },
};

export const NoRating: Story = {
  args: {
    book: {
      ...mockBook,
      average_rating: null,
      ratings_count: null,
    },
  },
};
