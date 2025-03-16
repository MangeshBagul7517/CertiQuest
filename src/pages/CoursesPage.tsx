
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Filter, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import CourseCard from "@/components/CourseCard";
import { Separator } from "@/components/ui/separator";

// Import sample data
import { allCourses } from "@/data/courses-data";

const CoursesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [filteredCourses, setFilteredCourses] = useState(allCourses);
  
  // Categories from our courses data
  const categories = [...new Set(allCourses.map(course => course.category))];
  const levels = ["Beginner", "Intermediate", "Advanced"];
  
  // Apply filters when any filter changes
  useEffect(() => {
    const filtered = allCourses.filter(course => {
      // Search filter
      const matchesSearch = searchQuery === "" || 
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        course.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Price filter
      const matchesPrice = course.price >= priceRange[0] && course.price <= priceRange[1];
      
      // Category filter
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(course.category);
      
      // Level filter
      const matchesLevel = selectedLevels.length === 0 || selectedLevels.includes(course.level);
      
      return matchesSearch && matchesPrice && matchesCategory && matchesLevel;
    });
    
    setFilteredCourses(filtered);
  }, [searchQuery, priceRange, selectedCategories, selectedLevels]);
  
  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };
  
  const toggleLevel = (level: string) => {
    setSelectedLevels(prev => 
      prev.includes(level)
        ? prev.filter(l => l !== level)
        : [...prev, level]
    );
  };
  
  const clearFilters = () => {
    setSearchQuery("");
    setPriceRange([0, 200]);
    setSelectedCategories([]);
    setSelectedLevels([]);
  };
  
  const hasActiveFilters = searchQuery !== "" || 
    priceRange[0] > 0 || 
    priceRange[1] < 200 || 
    selectedCategories.length > 0 || 
    selectedLevels.length > 0;
  
  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-grow pt-24">
          {/* Hero Section */}
          <section className="bg-secondary/30 py-12 md:py-20">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl">
                <Badge variant="outline" className="mb-4">
                  Browse All Courses
                </Badge>
                <h1 className="heading-lg mb-4">Discover Certification Courses</h1>
                <p className="subheading mb-8">
                  Explore our comprehensive catalog of professional certification courses designed to help you advance your career.
                </p>
                
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <Input
                    type="search"
                    placeholder="Search for courses..."
                    className="pl-10 py-6 bg-white/80 backdrop-blur-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </section>
          
          {/* Courses Section */}
          <section className="py-12">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Filters - Desktop */}
                <div className="hidden md:block w-64 shrink-0">
                  <div className="sticky top-24 glass-card rounded-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="font-semibold text-lg">Filters</h2>
                      {hasActiveFilters && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={clearFilters}
                          className="h-8 text-xs"
                        >
                          Clear All
                        </Button>
                      )}
                    </div>
                    
                    {/* Price Range */}
                    <div className="mb-6">
                      <h3 className="font-medium mb-3">Price Range</h3>
                      <Slider
                        defaultValue={[0, 200]}
                        max={200}
                        step={1}
                        value={priceRange}
                        onValueChange={setPriceRange}
                        className="mb-2"
                      />
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}</span>
                      </div>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    {/* Categories */}
                    <div className="mb-6">
                      <h3 className="font-medium mb-3">Categories</h3>
                      <div className="space-y-2">
                        {categories.map((category) => (
                          <div key={category} className="flex items-center">
                            <Checkbox
                              id={`category-${category}`}
                              checked={selectedCategories.includes(category)}
                              onCheckedChange={() => toggleCategory(category)}
                            />
                            <label 
                              htmlFor={`category-${category}`}
                              className="ml-2 text-sm cursor-pointer"
                            >
                              {category}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    {/* Levels */}
                    <div>
                      <h3 className="font-medium mb-3">Level</h3>
                      <div className="space-y-2">
                        {levels.map((level) => (
                          <div key={level} className="flex items-center">
                            <Checkbox
                              id={`level-${level}`}
                              checked={selectedLevels.includes(level)}
                              onCheckedChange={() => toggleLevel(level)}
                            />
                            <label 
                              htmlFor={`level-${level}`}
                              className="ml-2 text-sm cursor-pointer"
                            >
                              {level}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Course Listings */}
                <div className="flex-grow">
                  {/* Mobile Filter Button */}
                  <div className="md:hidden flex items-center justify-between mb-6">
                    <div>
                      <span className="text-lg font-semibold">
                        {filteredCourses.length} {filteredCourses.length === 1 ? 'Course' : 'Courses'}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setMobileFiltersOpen(true)}
                      className="gap-2"
                    >
                      <Filter className="h-4 w-4" />
                      Filters
                      {hasActiveFilters && (
                        <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center">{[
                          selectedCategories.length > 0 ? 1 : 0,
                          selectedLevels.length > 0 ? 1 : 0,
                          searchQuery !== "" ? 1 : 0,
                          priceRange[0] > 0 || priceRange[1] < 200 ? 1 : 0
                        ].filter(Boolean).length}</Badge>
                      )}
                    </Button>
                  </div>
                  
                  {/* Results */}
                  {filteredCourses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {filteredCourses.map((course, index) => (
                        <motion.div
                          key={course.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.05 }}
                        >
                          <CourseCard {...course} />
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="glass-card rounded-lg p-12 text-center">
                      <h3 className="text-xl font-semibold mb-2">No courses found</h3>
                      <p className="text-muted-foreground mb-6">
                        Try adjusting your search or filter criteria
                      </p>
                      <Button onClick={clearFilters}>
                        Clear Filters
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
          
          {/* Mobile Filters Drawer */}
          {mobileFiltersOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 md:hidden"
              onClick={() => setMobileFiltersOpen(false)}
            >
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="fixed top-0 right-0 h-full w-4/5 max-w-md bg-background shadow-xl overflow-y-auto p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-semibold text-lg flex items-center">
                    <Filter className="h-5 w-5 mr-2" />
                    Filters
                  </h2>
                  <div className="flex items-center gap-2">
                    {hasActiveFilters && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={clearFilters}
                        className="h-8 text-xs"
                      >
                        Clear All
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setMobileFiltersOpen(false)}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                
                {/* Price Range */}
                <div className="mb-6">
                  <h3 className="font-medium mb-3">Price Range</h3>
                  <Slider
                    defaultValue={[0, 200]}
                    max={200}
                    step={1}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="mb-2"
                  />
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                {/* Categories */}
                <div className="mb-6">
                  <h3 className="font-medium mb-3">Categories</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div key={category} className="flex items-center">
                        <Checkbox
                          id={`mobile-category-${category}`}
                          checked={selectedCategories.includes(category)}
                          onCheckedChange={() => toggleCategory(category)}
                        />
                        <label 
                          htmlFor={`mobile-category-${category}`}
                          className="ml-2 text-sm cursor-pointer"
                        >
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                {/* Levels */}
                <div className="mb-6">
                  <h3 className="font-medium mb-3">Level</h3>
                  <div className="space-y-2">
                    {levels.map((level) => (
                      <div key={level} className="flex items-center">
                        <Checkbox
                          id={`mobile-level-${level}`}
                          checked={selectedLevels.includes(level)}
                          onCheckedChange={() => toggleLevel(level)}
                        />
                        <label 
                          htmlFor={`mobile-level-${level}`}
                          className="ml-2 text-sm cursor-pointer"
                        >
                          {level}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="pt-4 mt-6 border-t sticky bottom-0 bg-background">
                  <Button 
                    className="w-full"
                    onClick={() => setMobileFiltersOpen(false)}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Apply Filters
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </main>
        
        <Footer />
      </div>
    </PageTransition>
  );
};

export default CoursesPage;
