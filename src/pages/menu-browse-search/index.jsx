import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomerNavigation from 'components/ui/CustomerNavigation';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';

function MenuBrowseSearch() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [filters, setFilters] = useState({
    dietary: [],
    priceRange: [0, 50],
    prepTime: 60,
    allergens: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [currentLocation] = useState('Downtown Branch');

  // Mock data for categories
  const categories = [
    { id: 'all', name: 'All Items', icon: 'Grid3X3' },
    { id: 'appetizers', name: 'Appetizers', icon: 'Utensils' },
    { id: 'mains', name: 'Main Course', icon: 'ChefHat' },
    { id: 'desserts', name: 'Desserts', icon: 'Cake' },
    { id: 'beverages', name: 'Beverages', icon: 'Coffee' },
    { id: 'salads', name: 'Salads', icon: 'Leaf' },
    { id: 'soups', name: 'Soups', icon: 'Bowl' }
  ];

  // Mock data for menu items
  const menuItems = [
    {
      id: 1,
      name: "Margherita Pizza",
      description: "Fresh mozzarella, tomato sauce, basil leaves on crispy thin crust",
      price: 18.99,
      originalPrice: 22.99,
      image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&h=300&fit=crop",
      category: "mains",
      dietary: ["vegetarian"],
      spiceLevel: 0,
      prepTime: 15,
      allergens: ["gluten", "dairy"],
      isAvailable: true,
      isPopular: true,
      discount: "Happy Hour 20% Off",
      rating: 4.8,
      reviewCount: 124
    },
    {
      id: 2,
      name: "Chicken Caesar Salad",
      description: "Grilled chicken breast, romaine lettuce, parmesan, croutons with caesar dressing",
      price: 14.99,
      image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop",
      category: "salads",
      dietary: ["protein-rich"],
      spiceLevel: 0,
      prepTime: 10,
      allergens: ["dairy", "eggs"],
      isAvailable: true,
      isPopular: false,
      rating: 4.6,
      reviewCount: 89
    },
    {
      id: 3,
      name: "Spicy Thai Curry",
      description: "Authentic red curry with coconut milk, vegetables, and jasmine rice",
      price: 16.99,
      image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&h=300&fit=crop",
      category: "mains",
      dietary: ["vegan", "gluten-free"],
      spiceLevel: 3,
      prepTime: 20,
      allergens: [],
      isAvailable: true,
      isPopular: true,
      rating: 4.7,
      reviewCount: 156
    },
    {
      id: 4,
      name: "Chocolate Lava Cake",
      description: "Warm chocolate cake with molten center, served with vanilla ice cream",
      price: 8.99,
      image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=300&fit=crop",
      category: "desserts",
      dietary: ["vegetarian"],
      spiceLevel: 0,
      prepTime: 12,
      allergens: ["gluten", "dairy", "eggs"],
      isAvailable: false,
      isPopular: true,
      rating: 4.9,
      reviewCount: 203
    },
    {
      id: 5,
      name: "Fresh Mango Smoothie",
      description: "Blend of fresh mangoes, yogurt, and honey with mint garnish",
      price: 6.99,
      image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400&h=300&fit=crop",
      category: "beverages",
      dietary: ["vegetarian", "gluten-free"],
      spiceLevel: 0,
      prepTime: 5,
      allergens: ["dairy"],
      isAvailable: true,
      isPopular: false,
      rating: 4.4,
      reviewCount: 67
    },
    {
      id: 6,
      name: "BBQ Bacon Burger",
      description: "Beef patty with crispy bacon, BBQ sauce, lettuce, tomato on brioche bun",
      price: 19.99,
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
      category: "mains",
      dietary: ["protein-rich"],
      spiceLevel: 1,
      prepTime: 18,
      allergens: ["gluten", "dairy"],
      isAvailable: true,
      isPopular: true,
      rating: 4.5,
      reviewCount: 178
    },
    {
      id: 7,
      name: "Tomato Basil Soup",
      description: "Creamy tomato soup with fresh basil, served with garlic bread",
      price: 9.99,
      image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop",
      category: "soups",
      dietary: ["vegetarian"],
      spiceLevel: 0,
      prepTime: 8,
      allergens: ["gluten", "dairy"],
      isAvailable: true,
      isPopular: false,
      rating: 4.3,
      reviewCount: 45
    },
    {
      id: 8,
      name: "Buffalo Wings",
      description: "Crispy chicken wings tossed in spicy buffalo sauce with blue cheese dip",
      price: 12.99,
      image: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400&h=300&fit=crop",
      category: "appetizers",
      dietary: ["protein-rich"],
      spiceLevel: 2,
      prepTime: 15,
      allergens: ["dairy"],
      isAvailable: true,
      isPopular: true,
      rating: 4.6,
      reviewCount: 134
    }
  ];

  // Filter and search logic
  const filteredItems = useMemo(() => {
    let filtered = menuItems;

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Dietary filters
    if (filters.dietary.length > 0) {
      filtered = filtered.filter(item =>
        filters.dietary.some(diet => item.dietary.includes(diet))
      );
    }

    // Price range filter
    filtered = filtered.filter(item =>
      item.price >= filters.priceRange[0] && item.price <= filters.priceRange[1]
    );

    // Prep time filter
    filtered = filtered.filter(item => item.prepTime <= filters.prepTime);

    // Allergen filter (exclude items with selected allergens)
    if (filters.allergens.length > 0) {
      filtered = filtered.filter(item =>
        !filters.allergens.some(allergen => item.allergens.includes(allergen))
      );
    }

    return filtered;
  }, [selectedCategory, searchQuery, filters, menuItems]);

  const handleAddToCart = (item) => {
    if (!item.isAvailable) return;
    
    setCartItems(prev => {
      const existingItem = prev.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const handleItemClick = (item) => {
    navigate('/item-detail-customization', { state: { item } });
  };

  const clearFilters = () => {
    setFilters({
      dietary: [],
      priceRange: [0, 50],
      prepTime: 60,
      allergens: []
    });
  };

  const activeFiltersCount = filters.dietary.length + filters.allergens.length + 
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 50 ? 1 : 0) +
    (filters.prepTime < 60 ? 1 : 0);

  const getDietaryIcon = (dietary) => {
    const icons = {
      'vegetarian': 'Leaf',
      'vegan': 'Sprout',
      'gluten-free': 'Wheat',
      'protein-rich': 'Zap'
    };
    return icons[dietary] || 'Circle';
  };

  const getSpiceLevelColor = (level) => {
    if (level === 0) return 'text-secondary-400';
    if (level === 1) return 'text-warning-400';
    if (level === 2) return 'text-accent-500';
    return 'text-error-500';
  };

  return (
    <div className="min-h-screen bg-background">
      <CustomerNavigation />
      
      {/* Main Content */}
      <main className="pt-16">
        {/* Search Header - Enhanced Responsive */}
        <div className="sticky top-16 z-dropdown bg-surface shadow-soft border-b border-border">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4">
            {/* Location and Search Row - Mobile Optimized */}
            <div className="flex flex-col space-y-3 sm:space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-3 sm:mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Icon name="MapPin" size={18} className="text-primary sm:w-5 sm:h-5" />
                  <span className="font-body font-body-medium text-text-primary text-sm sm:text-base">
                    {currentLocation}
                  </span>
                </div>
                <button
                  onClick={() => setIsFilterOpen(true)}
                  className="flex items-center space-x-2 px-3 py-2 border border-border rounded-lg hover:bg-secondary-50 transition-smooth md:hidden min-h-touch"
                >
                  <Icon name="Filter" size={18} />
                  <span className="font-body font-body-medium text-sm">Filters</span>
                  {activeFiltersCount > 0 && (
                    <span className="bg-primary text-white text-xs rounded-full px-2 py-1 min-w-[20px] h-5 flex items-center justify-center">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>
              </div>

              {/* Desktop Filter Button */}
              <button
                onClick={() => setIsFilterOpen(true)}
                className="hidden md:flex lg:hidden items-center space-x-2 px-4 py-2 border border-border rounded-lg hover:bg-secondary-50 transition-smooth"
              >
                <Icon name="Filter" size={20} />
                <span className="font-body font-body-medium">Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="bg-primary text-white text-xs rounded-full px-2 py-1">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>

            {/* Search Bar - Enhanced Mobile */}
            <div className="relative">
              <Icon name="Search" size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Search dishes, cuisines, ingredients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-10 py-2.5 sm:py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-body text-sm sm:text-base min-h-touch"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text-primary p-1"
                >
                  <Icon name="X" size={18} />
                </button>
              )}
            </div>

            {/* Active Filters - Mobile Optimized */}
            {activeFiltersCount > 0 && (
              <div className="flex items-center space-x-2 mt-3 flex-wrap gap-y-2">
                <span className="text-xs sm:text-sm font-body text-text-secondary">Active filters:</span>
                {filters.dietary.map(diet => (
                  <span key={diet} className="inline-flex items-center space-x-1 px-2 py-1 bg-primary-100 text-primary rounded-full text-xs font-body">
                    <span className="capitalize">{diet}</span>
                    <button
                      onClick={() => setFilters(prev => ({
                        ...prev,
                        dietary: prev.dietary.filter(d => d !== diet)
                      }))}
                      className="hover:bg-primary-200 rounded-full p-0.5 transition-smooth"
                    >
                      <Icon name="X" size={10} />
                    </button>
                  </span>
                ))}
                <button
                  onClick={clearFilters}
                  className="text-xs sm:text-sm text-primary hover:text-primary-700 font-body-medium min-h-touch px-1"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex gap-4 lg:gap-6">
            {/* Desktop Filters Sidebar - Enhanced */}
            <div className="hidden lg:block w-64 xl:w-72 flex-shrink-0">
              <div className="bg-surface rounded-lg shadow-soft p-6 sticky top-32">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-heading font-heading-medium text-text-primary">
                    Filters
                  </h3>
                  {activeFiltersCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="text-sm text-primary hover:text-primary-700 font-body-medium"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                {/* Dietary Preferences */}
                <div className="mb-6">
                  <h4 className="font-body font-body-medium text-text-primary mb-3">
                    Dietary Preferences
                  </h4>
                  <div className="space-y-2">
                    {['vegetarian', 'vegan', 'gluten-free', 'protein-rich'].map(diet => (
                      <label key={diet} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.dietary.includes(diet)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilters(prev => ({
                                ...prev,
                                dietary: [...prev.dietary, diet]
                              }));
                            } else {
                              setFilters(prev => ({
                                ...prev,
                                dietary: prev.dietary.filter(d => d !== diet)
                              }));
                            }
                          }}
                          className="rounded border-border text-primary focus:ring-primary"
                        />
                        <span className="text-sm font-body text-text-secondary capitalize">
                          {diet.replace('-', ' ')}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <h4 className="font-body font-body-medium text-text-primary mb-3">
                    Price Range
                  </h4>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="50"
                      value={filters.priceRange[1]}
                      onChange={(e) => setFilters(prev => ({
                        ...prev,
                        priceRange: [0, parseInt(e.target.value)]
                      }))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm font-body text-text-secondary">
                      <span>$0</span>
                      <span>${filters.priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                {/* Allergens */}
                <div>
                  <h4 className="font-body font-body-medium text-text-primary mb-3">
                    Exclude Allergens
                  </h4>
                  <div className="space-y-2">
                    {['gluten', 'dairy', 'eggs', 'nuts'].map(allergen => (
                      <label key={allergen} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.allergens.includes(allergen)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilters(prev => ({
                                ...prev,
                                allergens: [...prev.allergens, allergen]
                              }));
                            } else {
                              setFilters(prev => ({
                                ...prev,
                                allergens: prev.allergens.filter(a => a !== allergen)
                              }));
                            }
                          }}
                          className="rounded border-border text-primary focus:ring-primary"
                        />
                        <span className="text-sm font-body text-text-secondary capitalize">
                          {allergen}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Area - Enhanced Responsive */}
            <div className="flex-1 min-w-0">
              {/* Category Tabs - Mobile Optimized */}
              <div className="mb-4 sm:mb-6">
                <div className="flex space-x-1 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg whitespace-nowrap transition-smooth font-body font-body-medium text-sm sm:text-base min-h-touch ${
                        selectedCategory === category.id
                          ? 'bg-primary text-white' : 'bg-surface text-text-secondary hover:text-primary hover:bg-primary-50'
                      }`}
                    >
                      <Icon name={category.icon} size={16} className="sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">{category.name}</span>
                      <span className="sm:hidden">{category.name.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Results Header - Mobile Optimized */}
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div>
                  <h2 className="text-lg sm:text-xl font-heading font-heading-medium text-text-primary">
                    {searchQuery ? `Search results for "${searchQuery}"` : 
                     selectedCategory === 'all' ? 'All Menu Items' : 
                     categories.find(c => c.id === selectedCategory)?.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-text-secondary font-body mt-1">
                    {filteredItems.length} items found
                  </p>
                </div>
              </div>

              {/* Menu Items Grid - Fully Responsive */}
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                  {[...Array(6)].map((_, index) => (
                    <div key={index} className="bg-surface rounded-lg shadow-soft overflow-hidden animate-pulse">
                      <div className="h-36 sm:h-48 bg-secondary-200"></div>
                      <div className="p-3 sm:p-4 space-y-3">
                        <div className="h-4 bg-secondary-200 rounded w-3/4"></div>
                        <div className="h-3 bg-secondary-200 rounded w-full"></div>
                        <div className="h-3 bg-secondary-200 rounded w-2/3"></div>
                        <div className="h-8 bg-secondary-200 rounded w-1/3"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="text-center py-8 sm:py-12">
                  <div className="w-16 h-16 sm:w-24 sm:h-24 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="Search" size={24} className="text-secondary-400 sm:w-8 sm:h-8" />
                  </div>
                  <h3 className="text-base sm:text-lg font-heading font-heading-medium text-text-primary mb-2">
                    No items found
                  </h3>
                  <p className="text-text-secondary font-body mb-4 text-sm sm:text-base px-4">
                    Try adjusting your search or filters to find what you're looking for.
                  </p>
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-smooth font-body font-body-medium text-sm sm:text-base min-h-touch"
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                  {filteredItems.map(item => (
                    <div
                      key={item.id}
                      className={`bg-surface rounded-lg shadow-soft overflow-hidden transition-smooth hover:shadow-floating cursor-pointer group ${
                        !item.isAvailable ? 'opacity-60' : ''
                      }`}
                      onClick={() => handleItemClick(item)}
                    >
                      {/* Image Container - Responsive Heights */}
                      <div className="relative h-36 sm:h-48 overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        
                        {/* Badges */}
                        <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex flex-col space-y-1 sm:space-y-2">
                          {item.isPopular && (
                            <span className="bg-accent text-white text-xs font-body font-body-medium px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                              Popular
                            </span>
                          )}
                          {item.discount && (
                            <span className="bg-error text-white text-xs font-body font-body-medium px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                              {item.discount}
                            </span>
                          )}
                        </div>

                        {/* Quick Add Button - Touch Optimized */}
                        {item.isAvailable && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(item);
                            }}
                            className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 w-8 h-8 sm:w-10 sm:h-10 bg-primary text-white rounded-full flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity hover:bg-primary-700 min-w-touch min-h-touch"
                          >
                            <Icon name="Plus" size={16} className="sm:w-5 sm:h-5" />
                          </button>
                        )}

                        {/* Unavailable Overlay */}
                        {!item.isAvailable && (
                          <div className="absolute inset-0 bg-secondary-900 bg-opacity-50 flex items-center justify-center">
                            <span className="bg-surface text-text-primary px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-body font-body-medium">
                              Currently Unavailable
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content - Mobile Optimized */}
                      <div className="p-3 sm:p-4">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-heading font-heading-medium text-text-primary group-hover:text-primary transition-smooth text-sm sm:text-base line-clamp-1 flex-1 mr-2">
                            {item.name}
                          </h3>
                          <div className="flex items-center space-x-1 text-xs sm:text-sm flex-shrink-0">
                            <Icon name="Star" size={12} className="text-warning-400 fill-current sm:w-3.5 sm:h-3.5" />
                            <span className="font-body text-text-secondary">{item.rating}</span>
                          </div>
                        </div>

                        {/* Description - Mobile Optimized */}
                        <p className="text-xs sm:text-sm text-text-secondary font-body mb-2 sm:mb-3 line-clamp-2">
                          {item.description}
                        </p>

                        {/* Dietary and Spice Info - Compact Mobile */}
                        <div className="flex items-center justify-between mb-2 sm:mb-3">
                          <div className="flex items-center space-x-2 sm:space-x-3">
                            {/* Dietary Icons */}
                            <div className="flex items-center space-x-1">
                              {item.dietary.slice(0, 2).map(diet => (
                                <div
                                  key={diet}
                                  className="w-4 h-4 sm:w-5 sm:h-5 bg-success-100 rounded-full flex items-center justify-center"
                                  title={diet}
                                >
                                  <Icon name={getDietaryIcon(diet)} size={10} className="text-success-600 sm:w-3 sm:h-3" />
                                </div>
                              ))}
                            </div>

                            {/* Spice Level */}
                            {item.spiceLevel > 0 && (
                              <div className="flex items-center space-x-0.5 sm:space-x-1">
                                {[...Array(3)].map((_, index) => (
                                  <Icon
                                    key={index}
                                    name="Flame"
                                    size={10}
                                    className={`sm:w-3 sm:h-3 ${index < item.spiceLevel ? getSpiceLevelColor(item.spiceLevel) : 'text-secondary-200'}`}
                                  />
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Prep Time */}
                          <div className="flex items-center space-x-1 text-xs text-text-secondary">
                            <Icon name="Clock" size={10} className="sm:w-3 sm:h-3" />
                            <span className="font-body">{item.prepTime}min</span>
                          </div>
                        </div>

                        {/* Price and Actions - Mobile Optimized */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1 sm:space-x-2">
                            <span className="text-base sm:text-lg font-heading font-heading-medium text-text-primary">
                              ${item.price}
                            </span>
                            {item.originalPrice && (
                              <span className="text-xs sm:text-sm text-text-secondary line-through font-body">
                                ${item.originalPrice}
                              </span>
                            )}
                          </div>
                          
                          {item.isAvailable && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddToCart(item);
                              }}
                              className="px-2 sm:px-3 py-1 sm:py-1.5 bg-primary-50 text-primary rounded-lg hover:bg-primary-100 transition-smooth text-xs sm:text-sm font-body font-body-medium min-h-touch"
                            >
                              Add
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Filter Modal - Enhanced */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-modal">
          <div className="fixed inset-0 bg-secondary-900 bg-opacity-50" onClick={() => setIsFilterOpen(false)}></div>
          <div className="fixed inset-x-0 bottom-0 bg-surface rounded-t-2xl shadow-floating max-h-[85vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-lg font-heading font-heading-medium text-text-primary">
                  Filters
                </h3>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="p-2 text-text-secondary hover:text-text-primary min-h-touch"
                >
                  <Icon name="X" size={20} />
                </button>
              </div>

              {/* Mobile filter content - Enhanced */}
              <div className="space-y-6">
                {/* Dietary Preferences */}
                <div>
                  <h4 className="font-body font-body-medium text-text-primary mb-3">
                    Dietary Preferences
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {['vegetarian', 'vegan', 'gluten-free', 'protein-rich'].map(diet => (
                      <label key={diet} className="flex items-center space-x-3 cursor-pointer py-1">
                        <input
                          type="checkbox"
                          checked={filters.dietary.includes(diet)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilters(prev => ({
                                ...prev,
                                dietary: [...prev.dietary, diet]
                              }));
                            } else {
                              setFilters(prev => ({
                                ...prev,
                                dietary: prev.dietary.filter(d => d !== diet)
                              }));
                            }
                          }}
                          className="rounded border-border text-primary focus:ring-primary w-4 h-4"
                        />
                        <span className="text-sm font-body text-text-secondary capitalize">
                          {diet.replace('-', ' ')}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h4 className="font-body font-body-medium text-text-primary mb-3">
                    Price Range
                  </h4>
                  <div className="space-y-3">
                    <input
                      type="range"
                      min="0"
                      max="50"
                      value={filters.priceRange[1]}
                      onChange={(e) => setFilters(prev => ({
                        ...prev,
                        priceRange: [0, parseInt(e.target.value)]
                      }))}
                      className="w-full h-6"
                    />
                    <div className="flex justify-between text-sm font-body text-text-secondary">
                      <span>$0</span>
                      <span>${filters.priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                {/* Allergens */}
                <div>
                  <h4 className="font-body font-body-medium text-text-primary mb-3">
                    Exclude Allergens
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {['gluten', 'dairy', 'eggs', 'nuts'].map(allergen => (
                      <label key={allergen} className="flex items-center space-x-3 cursor-pointer py-1">
                        <input
                          type="checkbox"
                          checked={filters.allergens.includes(allergen)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilters(prev => ({
                                ...prev,
                                allergens: [...prev.allergens, allergen]
                              }));
                            } else {
                              setFilters(prev => ({
                                ...prev,
                                allergens: prev.allergens.filter(a => a !== allergen)
                              }));
                            }
                          }}
                          className="rounded border-border text-primary focus:ring-primary w-4 h-4"
                        />
                        <span className="text-sm font-body text-text-secondary capitalize">
                          {allergen}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons - Touch Optimized */}
              <div className="flex space-x-3 mt-6 pt-6 border-t border-border">
                <button
                  onClick={clearFilters}
                  className="flex-1 px-4 py-3 border border-border text-text-secondary rounded-lg hover:bg-secondary-50 transition-smooth font-body font-body-medium min-h-touch"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="flex-1 px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary-700 transition-smooth font-body font-body-medium min-h-touch"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MenuBrowseSearch;