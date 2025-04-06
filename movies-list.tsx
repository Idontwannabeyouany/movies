"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, Search, Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type Movie = {
  id: number
  title: string
  posterPath: string
  releaseYear: number
  rating: number
  genres: string[]
}

export default function MoviesList() {
  const [movies, setMovies] = useState<Movie[]>([
    {
      id: 1,
      title: "Inception",
      posterPath: "/placeholder.svg?height=450&width=300",
      releaseYear: 2010,
      rating: 4.8,
      genres: ["Sci-Fi", "Action", "Thriller"],
    },
    {
      id: 2,
      title: "The Shawshank Redemption",
      posterPath: "/placeholder.svg?height=450&width=300",
      releaseYear: 1994,
      rating: 4.9,
      genres: ["Drama", "Crime"],
    },
    {
      id: 3,
      title: "The Dark Knight",
      posterPath: "/placeholder.svg?height=450&width=300",
      releaseYear: 2008,
      rating: 4.7,
      genres: ["Action", "Crime", "Drama"],
    },
    {
      id: 4,
      title: "Pulp Fiction",
      posterPath: "/placeholder.svg?height=450&width=300",
      releaseYear: 1994,
      rating: 4.6,
      genres: ["Crime", "Drama"],
    },
    {
      id: 5,
      title: "The Lord of the Rings: The Return of the King",
      posterPath: "/placeholder.svg?height=450&width=300",
      releaseYear: 2003,
      rating: 4.9,
      genres: ["Adventure", "Fantasy", "Action"],
    },
    {
      id: 6,
      title: "Forrest Gump",
      posterPath: "/placeholder.svg?height=450&width=300",
      releaseYear: 1994,
      rating: 4.8,
      genres: ["Drama", "Romance", "Comedy"],
    },
    {
      id: 7,
      title: "The Matrix",
      posterPath: "/placeholder.svg?height=450&width=300",
      releaseYear: 1999,
      rating: 4.7,
      genres: ["Sci-Fi", "Action"],
    },
    {
      id: 8,
      title: "Goodfellas",
      posterPath: "/placeholder.svg?height=450&width=300",
      releaseYear: 1990,
      rating: 4.7,
      genres: ["Crime", "Drama", "Biography"],
    },
  ])

  const [favorites, setFavorites] = useState<number[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [activeGenres, setActiveGenres] = useState<string[]>([])
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>(movies)

  // Get all unique genres
  const allGenres = Array.from(new Set(movies.flatMap((movie) => movie.genres))).sort()

  // Toggle favorite status
  const toggleFavorite = (id: number, e: React.MouseEvent) => {
    e.preventDefault() // Prevent link navigation
    setFavorites((prev) => (prev.includes(id) ? prev.filter((movieId) => movieId !== id) : [...prev, id]))
  }

  // Apply filters and search
  useEffect(() => {
    let result = movies

    // Apply search filter
    if (searchTerm) {
      result = result.filter((movie) => movie.title.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    // Apply genre filters
    if (activeGenres.length > 0) {
      result = result.filter((movie) => activeGenres.some((genre) => movie.genres.includes(genre)))
    }

    setFilteredMovies(result)
  }, [movies, searchTerm, activeGenres])

  // Toggle genre filter
  const toggleGenre = (genre: string) => {
    setActiveGenres((prev) => (prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]))
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Movies Collection</h1>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search movies..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Genres {activeGenres.length > 0 && `(${activeGenres.length})`}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            {allGenres.map((genre) => (
              <DropdownMenuCheckboxItem
                key={genre}
                checked={activeGenres.includes(genre)}
                onCheckedChange={() => toggleGenre(genre)}
              >
                {genre}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant={favorites.length > 0 ? "default" : "outline"}
          onClick={() => setActiveGenres(favorites.length > 0 ? [] : ["favorites"])}
        >
          <Heart className={`mr-2 h-4 w-4 ${favorites.length > 0 ? "fill-current" : ""}`} />
          Favorites {favorites.length > 0 && `(${favorites.length})`}
        </Button>
      </div>

      {/* Movies Grid */}
      {filteredMovies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredMovies.map((movie) => (
            <Link key={movie.id} href={`/movies/${movie.id}`} className="group">
              <Card className="overflow-hidden transition-all duration-200 hover:shadow-lg">
                <div className="relative aspect-[2/3] w-full">
                  <Image
                    src={movie.posterPath || "/placeholder.svg"}
                    alt={`${movie.title} poster`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
                  />
                  <button
                    onClick={(e) => toggleFavorite(movie.id, e)}
                    className="absolute top-2 right-2 p-1.5 bg-background/80 backdrop-blur-sm rounded-full transition-all hover:bg-background"
                    aria-label={favorites.includes(movie.id) ? "Remove from favorites" : "Add to favorites"}
                  >
                    <Heart
                      className={`h-5 w-5 ${favorites.includes(movie.id) ? "fill-red-500 text-red-500" : "text-muted-foreground"}`}
                    />
                  </button>
                </div>
                <CardContent className="p-3">
                  <div className="flex items-center mb-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                    <span className="text-sm font-medium">{movie.rating}</span>
                  </div>
                  <h2 className="font-medium text-sm line-clamp-1 group-hover:text-primary transition-colors">
                    {movie.title}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-1">{movie.releaseYear}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {movie.genres.slice(0, 2).map((genre) => (
                      <Badge key={genre} variant="secondary" className="text-xs px-1.5 py-0">
                        {genre}
                      </Badge>
                    ))}
                    {movie.genres.length > 2 && (
                      <Badge variant="outline" className="text-xs px-1.5 py-0">
                        +{movie.genres.length - 2}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No movies found matching your criteria.</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setSearchTerm("")
              setActiveGenres([])
            }}
          >
            Clear filters
          </Button>
        </div>
      )}
    </div>
  )
}

