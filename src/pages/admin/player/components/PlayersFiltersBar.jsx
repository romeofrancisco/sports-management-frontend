import React from "react";
import { SearchFilter, FilterSport, FilterSex, FilterYearLevel, FilterCourse } from "@/components/common/Filters";
import { Search, Filter, X, Sparkles, Trophy, Users, GraduationCap, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSports } from "@/hooks/useSports";
import { YEAR_LEVEL_CHOICES, COURSE_CHOICES, SEX } from "@/constants/player";

const PlayersFiltersBar = ({ filter, setFilter }) => {
  const { data: sports } = useSports();
  const hasActiveFilters = filter.search || filter.sport || filter.sex || filter.year_level || filter.course;
  
  const clearAllFilters = () => {
    setFilter({
      search: "",
      sex: null,
      sport: null,
      year_level: null,
      course: null,
    });
  };

  const clearSpecificFilter = (filterType) => {
    const defaultValues = {
      search: "",
      sex: null,
      sport: null, 
      year_level: null,
      course: null
    };
    setFilter((prev) => ({ ...prev, [filterType]: defaultValues[filterType] }));
  };
  // Helper functions to get display names
  const getSportName = () => {
    if (!filter.sport || !sports) return null;
    const sport = sports.find(s => s.id === parseInt(filter.sport));
    return sport?.name || null;
  };

  const getSexLabel = () => {
    if (!filter.sex) return null;
    const sex = SEX.find(s => s.value === filter.sex);
    return sex?.label || filter.sex;
  };

  const getYearLevelLabel = () => {
    if (!filter.year_level) return null;
    const yearLevel = YEAR_LEVEL_CHOICES.find(y => y.value === filter.year_level);
    return yearLevel?.label || filter.year_level;
  };

  const getCourseLabel = () => {
    if (!filter.course) return null;
    const course = COURSE_CHOICES.find(c => c.value === filter.course);
    return course?.label || filter.course;
  };  return (
    <div className="space-y-3">
      {/* Responsive Filter Controls */}
      <div className="flex flex-col lg:flex-row gap-3 p-3 bg-gradient-to-r from-card/60 to-card/40 backdrop-blur-sm border border-primary/20 rounded-lg">
        {/* Search Filter - Full width on mobile, flex-1 on desktop */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <SearchFilter
            value={filter.search}
            onChange={(val) => setFilter((prev) => ({ ...prev, search: val }))}
            className="flex-1 bg-transparent border-0 focus:ring-0 text-sm placeholder:text-muted-foreground/60 min-w-0"
            placeholder="Search players..."
            hideLabel={true}
          />
        </div>

        {/* Filter Row - Wraps on mobile, single row on desktop */}
        <div className="flex flex-wrap lg:flex-nowrap items-center gap-2 lg:gap-3">
          {/* Sport Filter */}
          <div className="flex items-center gap-1.5 min-w-0">
            <Trophy className="h-4 w-4 text-muted-foreground shrink-0" />
            <FilterSport
              value={filter.sport}
              onChange={(val) => setFilter((prev) => ({ ...prev, sport: val }))}
              className="min-w-[120px] lg:min-w-[140px]"
              hideLabel={true}
            />
          </div>

          {/* Gender Filter */}
          <div className="flex items-center gap-1.5 min-w-0">
            <Users className="h-4 w-4 text-muted-foreground shrink-0" />
            <FilterSex
              value={filter.sex}
              onChange={(val) => setFilter((prev) => ({ ...prev, sex: val }))}
              className="min-w-[100px] lg:min-w-[120px]"
              hideLabel={true}
            />
          </div>

          {/* Year Level Filter */}
          <div className="flex items-center gap-1.5 min-w-0">
            <GraduationCap className="h-4 w-4 text-muted-foreground shrink-0" />
            <FilterYearLevel
              value={filter.year_level}
              onChange={(val) => setFilter((prev) => ({ ...prev, year_level: val }))}
              className="min-w-[120px] lg:min-w-[140px]"
              hideLabel={true}
            />
          </div>

          {/* Course Filter */}
          <div className="flex items-center gap-1.5 min-w-0">
            <BookOpen className="h-4 w-4 text-muted-foreground shrink-0" />
            <FilterCourse
              value={filter.course}
              onChange={(val) => setFilter((prev) => ({ ...prev, course: val }))}
              className="min-w-[140px] lg:min-w-[160px]"
              hideLabel={true}
            />
          </div>

          {/* Clear All Button */}
          {hasActiveFilters && (
            <Button
              onClick={clearAllFilters}
              variant="outline"
              size="sm"
              className="shrink-0 text-destructive hover:bg-destructive/10 border-destructive/30"
            >
              <X className="mr-1 h-3 w-3" />
              <span className="hidden sm:inline">Clear</span>
            </Button>
          )}
        </div>
      </div>      
      {/* Responsive Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 p-2 bg-primary/5 border border-primary/20 rounded-lg">
          <span className="text-xs font-medium text-muted-foreground shrink-0">Active filters:</span>
          
          {filter.search && (
            <Badge variant="secondary" className="text-xs flex items-center gap-1">
              <Search className="h-3 w-3" />
              "{filter.search}"
              <Button
                onClick={() => clearSpecificFilter('search')}
                variant="ghost"
                size="sm"
                className="ml-1 h-3 w-3 p-0 hover:bg-destructive/20"
              >
                <X className="h-2 w-2" />
              </Button>
            </Badge>
          )}
            {filter.sport && getSportName() && (
            <Badge variant="secondary" className="text-xs flex items-center gap-1">
              <Trophy className="h-3 w-3" />
              {getSportName()}
              <Button
                onClick={() => clearSpecificFilter('sport')}
                variant="ghost"
                size="sm"
                className="ml-1 h-3 w-3 p-0 hover:bg-destructive/20"
              >
                <X className="h-2 w-2" />
              </Button>
            </Badge>
          )}
          
          {filter.sex && getSexLabel() && (
            <Badge variant="secondary" className="text-xs flex items-center gap-1">
              <Users className="h-3 w-3" />
              {getSexLabel()}
              <Button
                onClick={() => clearSpecificFilter('sex')}
                variant="ghost"
                size="sm"
                className="ml-1 h-3 w-3 p-0 hover:bg-destructive/20"
              >
                <X className="h-2 w-2" />
              </Button>
            </Badge>
          )}
          
          {filter.year_level && getYearLevelLabel() && (
            <Badge variant="secondary" className="text-xs flex items-center gap-1">
              <GraduationCap className="h-3 w-3" />
              {getYearLevelLabel()}
              <Button
                onClick={() => clearSpecificFilter('year_level')}
                variant="ghost"
                size="sm"
                className="ml-1 h-3 w-3 p-0 hover:bg-destructive/20"
              >
                <X className="h-2 w-2" />
              </Button>
            </Badge>
          )}
          
          {filter.course && getCourseLabel() && (
            <Badge variant="secondary" className="text-xs flex items-center gap-1">
              <BookOpen className="h-3 w-3" />
              {getCourseLabel()}
              <Button
                onClick={() => clearSpecificFilter('course')}
                variant="ghost"
                size="sm"
                className="ml-1 h-3 w-3 p-0 hover:bg-destructive/20"
              >
                <X className="h-2 w-2" />
              </Button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default PlayersFiltersBar;
