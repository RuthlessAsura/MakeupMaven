import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { getQueryFn, apiRequest } from "@/lib/queryClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, PencilIcon, Trash2, EyeIcon, CheckCircle, XCircle, PlusCircle } from "lucide-react";

type SiteContent = {
  id: number;
  section: string;
  key: string;
  value: string;
  updatedAt: string;
};

type PortfolioItem = {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  order: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

type ServiceItem = {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  price: string;
  order: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

type TestimonialItem = {
  id: number;
  quote: string;
  name: string;
  role: string;
  order: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

import AdminLogin from "@/components/admin-login";

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const queryClient = useQueryClient();

  // Authentication state
  useEffect(() => {
    // Check if there are stored credentials
    const storedCredentials = localStorage.getItem("adminCredentials");
    if (storedCredentials) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("adminCredentials");
    
    toast({
      title: "Uitgelogd",
      description: "U bent succesvol uitgelogd",
    });
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    queryClient.invalidateQueries();
  };

  // Custom headers for authenticated requests
  const getAuthHeaders = () => {
    const storedCredentials = localStorage.getItem("adminCredentials");
    return {
      "Authorization": `Basic ${storedCredentials || ""}`,
    };
  };

  // Site Content Management
  const [selectedSection, setSelectedSection] = useState("hero");
  const [editContentId, setEditContentId] = useState<number | null>(null);
  const [editContentValue, setEditContentValue] = useState("");

  const { data: contentData = [], isLoading: isLoadingContent } = useQuery<SiteContent[]>({
    queryKey: [`/api/admin/content/${selectedSection}`, selectedSection],
    queryFn: getQueryFn<SiteContent[]>({ 
      on401: "returnNull", 
      customHeaders: getAuthHeaders()
    }),
    enabled: isAuthenticated,
  });

  const updateContentMutation = useMutation({
    mutationFn: async ({ id, value }: { id: number; value: string }) => {
      return apiRequest(`/api/admin/content/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ value }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/admin/content/${selectedSection}`] });
      setEditContentId(null);
      setEditContentValue("");
      toast({
        title: "Success",
        description: "Content updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update content",
        variant: "destructive",
      });
    },
  });

  const handleUpdateContent = (id: number) => {
    updateContentMutation.mutate({ id, value: editContentValue });
  };

  // Portfolio Management
  const [selectedPortfolioItem, setSelectedPortfolioItem] = useState<PortfolioItem | null>(null);
  const [isPortfolioDialogOpen, setIsPortfolioDialogOpen] = useState(false);

  const { data: portfolioData = [], isLoading: isLoadingPortfolio } = useQuery<PortfolioItem[]>({
    queryKey: ['/api/admin/portfolio'],
    queryFn: getQueryFn<PortfolioItem[]>({ 
      on401: "returnNull", 
      customHeaders: getAuthHeaders()
    }),
    enabled: isAuthenticated,
  });

  const createPortfolioMutation = useMutation({
    mutationFn: async (item: Omit<PortfolioItem, 'id' | 'createdAt' | 'updatedAt'>) => {
      return apiRequest('/api/admin/portfolio', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(item),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/portfolio'] });
      setIsPortfolioDialogOpen(false);
      setSelectedPortfolioItem(null);
      toast({
        title: "Success",
        description: "Portfolio item created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create portfolio item",
        variant: "destructive",
      });
    },
  });

  const updatePortfolioMutation = useMutation({
    mutationFn: async (item: Partial<PortfolioItem> & { id: number }) => {
      return apiRequest(`/api/admin/portfolio/${item.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(item),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/portfolio'] });
      setIsPortfolioDialogOpen(false);
      setSelectedPortfolioItem(null);
      toast({
        title: "Success",
        description: "Portfolio item updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update portfolio item",
        variant: "destructive",
      });
    },
  });

  const deletePortfolioMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/admin/portfolio/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/portfolio'] });
      toast({
        title: "Success",
        description: "Portfolio item deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete portfolio item",
        variant: "destructive",
      });
    },
  });

  const handleCreatePortfolio = () => {
    if (!selectedPortfolioItem) return;
    
    const item = {
      title: selectedPortfolioItem.title,
      description: selectedPortfolioItem.description,
      imageUrl: selectedPortfolioItem.imageUrl,
      category: selectedPortfolioItem.category,
      order: selectedPortfolioItem.order,
      active: selectedPortfolioItem.active,
    };
    
    createPortfolioMutation.mutate(item);
  };

  const handleUpdatePortfolio = () => {
    if (!selectedPortfolioItem) return;
    
    updatePortfolioMutation.mutate(selectedPortfolioItem);
  };

  const handleDeletePortfolio = (id: number) => {
    if (confirm("Are you sure you want to delete this item?")) {
      deletePortfolioMutation.mutate(id);
    }
  };

  // Services Management
  const [selectedServiceItem, setSelectedServiceItem] = useState<ServiceItem | null>(null);
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);

  // Testimonials Management
  const [selectedTestimonialItem, setSelectedTestimonialItem] = useState<TestimonialItem | null>(null);
  const [isTestimonialDialogOpen, setIsTestimonialDialogOpen] = useState(false);

  const { data: servicesData = [], isLoading: isLoadingServices } = useQuery<ServiceItem[]>({
    queryKey: ['/api/admin/services'],
    queryFn: getQueryFn<ServiceItem[]>({ 
      on401: "returnNull", 
      customHeaders: getAuthHeaders()
    }),
    enabled: isAuthenticated,
  });
  
  const { data: testimonialsData = [], isLoading: isLoadingTestimonials } = useQuery<TestimonialItem[]>({
    queryKey: ['/api/admin/testimonials'],
    queryFn: getQueryFn<TestimonialItem[]>({ 
      on401: "returnNull", 
      customHeaders: getAuthHeaders()
    }),
    enabled: isAuthenticated,
  });

  const createServiceMutation = useMutation({
    mutationFn: async (item: Omit<ServiceItem, 'id' | 'createdAt' | 'updatedAt'>) => {
      return apiRequest('/api/admin/services', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(item),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/services'] });
      setIsServiceDialogOpen(false);
      setSelectedServiceItem(null);
      toast({
        title: "Success",
        description: "Service created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create service",
        variant: "destructive",
      });
    },
  });

  const updateServiceMutation = useMutation({
    mutationFn: async (item: Partial<ServiceItem> & { id: number }) => {
      return apiRequest(`/api/admin/services/${item.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(item),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/services'] });
      setIsServiceDialogOpen(false);
      setSelectedServiceItem(null);
      toast({
        title: "Success",
        description: "Service updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update service",
        variant: "destructive",
      });
    },
  });

  const deleteServiceMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/admin/services/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/services'] });
      toast({
        title: "Success",
        description: "Service deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete service",
        variant: "destructive",
      });
    },
  });

  const handleCreateService = () => {
    if (!selectedServiceItem) return;
    
    const item = {
      title: selectedServiceItem.title,
      description: selectedServiceItem.description,
      imageUrl: selectedServiceItem.imageUrl,
      price: selectedServiceItem.price,
      order: selectedServiceItem.order,
      active: selectedServiceItem.active,
    };
    
    createServiceMutation.mutate(item);
  };

  const handleUpdateService = () => {
    if (!selectedServiceItem) return;
    
    updateServiceMutation.mutate(selectedServiceItem);
  };

  const handleDeleteService = (id: number) => {
    if (confirm("Are you sure you want to delete this service?")) {
      deleteServiceMutation.mutate(id);
    }
  };
  
  // Testimonial mutations
  const createTestimonialMutation = useMutation({
    mutationFn: async (item: Omit<TestimonialItem, 'id' | 'createdAt' | 'updatedAt'>) => {
      return apiRequest('/api/admin/testimonials', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(item),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/testimonials'] });
      setIsTestimonialDialogOpen(false);
      setSelectedTestimonialItem(null);
      toast({
        title: "Success",
        description: "Testimonial created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create testimonial",
        variant: "destructive",
      });
    },
  });

  const updateTestimonialMutation = useMutation({
    mutationFn: async (item: Partial<TestimonialItem> & { id: number }) => {
      return apiRequest(`/api/admin/testimonials/${item.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(item),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/testimonials'] });
      setIsTestimonialDialogOpen(false);
      setSelectedTestimonialItem(null);
      toast({
        title: "Success",
        description: "Testimonial updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update testimonial",
        variant: "destructive",
      });
    },
  });

  const deleteTestimonialMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/admin/testimonials/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/testimonials'] });
      toast({
        title: "Success",
        description: "Testimonial deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete testimonial",
        variant: "destructive",
      });
    },
  });

  const handleCreateTestimonial = () => {
    if (!selectedTestimonialItem) return;
    
    const item = {
      quote: selectedTestimonialItem.quote,
      name: selectedTestimonialItem.name,
      role: selectedTestimonialItem.role,
      order: selectedTestimonialItem.order,
      active: selectedTestimonialItem.active,
    };
    
    createTestimonialMutation.mutate(item);
  };

  const handleUpdateTestimonial = () => {
    if (!selectedTestimonialItem) return;
    
    updateTestimonialMutation.mutate(selectedTestimonialItem);
  };

  const handleDeleteTestimonial = (id: number) => {
    if (confirm("Are you sure you want to delete this testimonial?")) {
      deleteTestimonialMutation.mutate(id);
    }
  };

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      <Tabs defaultValue="content">
        <TabsList className="mb-8 grid w-full grid-cols-4">
          <TabsTrigger value="content">Site Content</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="testimonials">Client Love</TabsTrigger>
        </TabsList>

        {/* Site Content Tab */}
        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle>Edit Website Content</CardTitle>
              <CardDescription>Update text content displayed on the website</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <Label htmlFor="section">Section</Label>
                <select
                  id="section"
                  className="w-full p-2 border rounded-md mt-1"
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                >
                  <option value="hero">Hero Section</option>
                  <option value="about">About Section</option>
                  <option value="services">Services Section</option>
                  <option value="contact">Contact Section</option>
                  <option value="footer">Footer</option>
                </select>
              </div>

              {isLoadingContent ? (
                <div className="flex items-center justify-center h-40">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : contentData && contentData.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Key</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead className="w-24">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contentData.map((content: SiteContent) => (
                      <TableRow key={content.id}>
                        <TableCell>{content.key}</TableCell>
                        <TableCell>
                          {editContentId === content.id ? (
                            <Textarea
                              value={editContentValue}
                              onChange={(e) => setEditContentValue(e.target.value)}
                              className="min-h-[100px]"
                            />
                          ) : (
                            <div className="max-h-[100px] overflow-auto">
                              {content.value}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {new Date(content.updatedAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {editContentId === content.id ? (
                            <div className="flex space-x-2">
                              <Button 
                                size="sm" 
                                onClick={() => handleUpdateContent(content.id)}
                                disabled={updateContentMutation.isPending}
                              >
                                Save
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => {
                                  setEditContentId(null);
                                  setEditContentValue("");
                                }}
                              >
                                Cancel
                              </Button>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditContentId(content.id);
                                setEditContentValue(content.value);
                              }}
                            >
                              <PencilIcon className="h-4 w-4" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <Alert>
                  <AlertTitle>No content found</AlertTitle>
                  <AlertDescription>
                    No content items have been created for this section yet.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Portfolio Tab */}
        <TabsContent value="portfolio">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Portfolio Items</CardTitle>
                  <CardDescription>Manage your portfolio items</CardDescription>
                </div>
                <Dialog open={isPortfolioDialogOpen} onOpenChange={setIsPortfolioDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      onClick={() => {
                        setSelectedPortfolioItem({
                          id: 0,
                          title: "",
                          description: "",
                          imageUrl: "",
                          category: "eyebrows",
                          order: 0,
                          active: true,
                          createdAt: "",
                          updatedAt: "",
                        });
                      }}
                    >
                      Add New Item
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>
                        {selectedPortfolioItem?.id ? "Edit Portfolio Item" : "Create Portfolio Item"}
                      </DialogTitle>
                      <DialogDescription>
                        {selectedPortfolioItem?.id
                          ? "Update the details of the portfolio item"
                          : "Add a new portfolio item to your website"}
                      </DialogDescription>
                    </DialogHeader>
                    {selectedPortfolioItem && (
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="title">Title</Label>
                          <Input
                            id="title"
                            value={selectedPortfolioItem.title}
                            onChange={(e) =>
                              setSelectedPortfolioItem({
                                ...selectedPortfolioItem,
                                title: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            value={selectedPortfolioItem.description}
                            onChange={(e) =>
                              setSelectedPortfolioItem({
                                ...selectedPortfolioItem,
                                description: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="imageUrl">Image URL</Label>
                          <Input
                            id="imageUrl"
                            value={selectedPortfolioItem.imageUrl}
                            onChange={(e) =>
                              setSelectedPortfolioItem({
                                ...selectedPortfolioItem,
                                imageUrl: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="category">Category</Label>
                          <select
                            id="category"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={selectedPortfolioItem.category}
                            onChange={(e) =>
                              setSelectedPortfolioItem({
                                ...selectedPortfolioItem,
                                category: e.target.value,
                              })
                            }
                          >
                            <option value="eyebrows">Eyebrows</option>
                            <option value="makeup">Makeup</option>
                            <option value="lashes">Lashes</option>
                          </select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="order">Display Order</Label>
                          <Input
                            id="order"
                            type="number"
                            value={selectedPortfolioItem.order}
                            onChange={(e) =>
                              setSelectedPortfolioItem({
                                ...selectedPortfolioItem,
                                order: parseInt(e.target.value),
                              })
                            }
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            id="active"
                            type="checkbox"
                            checked={selectedPortfolioItem.active}
                            onChange={(e) =>
                              setSelectedPortfolioItem({
                                ...selectedPortfolioItem,
                                active: e.target.checked,
                              })
                            }
                          />
                          <Label htmlFor="active">Active</Label>
                        </div>
                      </div>
                    )}
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsPortfolioDialogOpen(false)}>
                        Cancel
                      </Button>
                      {selectedPortfolioItem?.id ? (
                        <Button
                          onClick={handleUpdatePortfolio}
                          disabled={
                            updatePortfolioMutation.isPending ||
                            !selectedPortfolioItem.title ||
                            !selectedPortfolioItem.imageUrl
                          }
                        >
                          {updatePortfolioMutation.isPending && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          Update
                        </Button>
                      ) : (
                        <Button
                          onClick={handleCreatePortfolio}
                          disabled={
                            createPortfolioMutation.isPending ||
                            !selectedPortfolioItem?.title ||
                            !selectedPortfolioItem?.imageUrl
                          }
                        >
                          {createPortfolioMutation.isPending && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          Create
                        </Button>
                      )}
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingPortfolio ? (
                <div className="flex items-center justify-center h-40">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : portfolioData && portfolioData.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Image</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Order</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-32">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {portfolioData.map((item: PortfolioItem) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-16 h-16 object-cover rounded"
                          />
                        </TableCell>
                        <TableCell>{item.title}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>{item.order}</TableCell>
                        <TableCell>
                          {item.active ? (
                            <span className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                              Active
                            </span>
                          ) : (
                            <span className="flex items-center">
                              <XCircle className="h-4 w-4 text-red-500 mr-1" />
                              Inactive
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedPortfolioItem(item);
                                setIsPortfolioDialogOpen(true);
                              }}
                            >
                              <PencilIcon className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeletePortfolio(item.id)}
                              disabled={deletePortfolioMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <Alert>
                  <AlertTitle>No portfolio items found</AlertTitle>
                  <AlertDescription>
                    You haven't added any portfolio items yet. Click "Add New Item" to get started.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Services Tab */}
        <TabsContent value="services">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Services</CardTitle>
                  <CardDescription>Manage your services</CardDescription>
                </div>
                <Dialog open={isServiceDialogOpen} onOpenChange={setIsServiceDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      onClick={() => {
                        setSelectedServiceItem({
                          id: 0,
                          title: "",
                          description: "",
                          imageUrl: "",
                          price: "",
                          order: 0,
                          active: true,
                          createdAt: "",
                          updatedAt: "",
                        });
                      }}
                    >
                      Add New Service
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>
                        {selectedServiceItem?.id ? "Edit Service" : "Create Service"}
                      </DialogTitle>
                      <DialogDescription>
                        {selectedServiceItem?.id
                          ? "Update the details of the service"
                          : "Add a new service to your website"}
                      </DialogDescription>
                    </DialogHeader>
                    {selectedServiceItem && (
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="title">Title</Label>
                          <Input
                            id="title"
                            value={selectedServiceItem.title}
                            onChange={(e) =>
                              setSelectedServiceItem({
                                ...selectedServiceItem,
                                title: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            value={selectedServiceItem.description}
                            onChange={(e) =>
                              setSelectedServiceItem({
                                ...selectedServiceItem,
                                description: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="imageUrl">Image URL</Label>
                          <Input
                            id="imageUrl"
                            value={selectedServiceItem.imageUrl}
                            onChange={(e) =>
                              setSelectedServiceItem({
                                ...selectedServiceItem,
                                imageUrl: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="price">Price</Label>
                          <Input
                            id="price"
                            value={selectedServiceItem.price}
                            onChange={(e) =>
                              setSelectedServiceItem({
                                ...selectedServiceItem,
                                price: e.target.value,
                              })
                            }
                            placeholder="e.g. $100 or From $100"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="order">Display Order</Label>
                          <Input
                            id="order"
                            type="number"
                            value={selectedServiceItem.order}
                            onChange={(e) =>
                              setSelectedServiceItem({
                                ...selectedServiceItem,
                                order: parseInt(e.target.value),
                              })
                            }
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            id="active"
                            type="checkbox"
                            checked={selectedServiceItem.active}
                            onChange={(e) =>
                              setSelectedServiceItem({
                                ...selectedServiceItem,
                                active: e.target.checked,
                              })
                            }
                          />
                          <Label htmlFor="active">Active</Label>
                        </div>
                      </div>
                    )}
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsServiceDialogOpen(false)}>
                        Cancel
                      </Button>
                      {selectedServiceItem?.id ? (
                        <Button
                          onClick={handleUpdateService}
                          disabled={
                            updateServiceMutation.isPending ||
                            !selectedServiceItem.title ||
                            !selectedServiceItem.imageUrl ||
                            !selectedServiceItem.price
                          }
                        >
                          {updateServiceMutation.isPending && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          Update
                        </Button>
                      ) : (
                        <Button
                          onClick={handleCreateService}
                          disabled={
                            createServiceMutation.isPending ||
                            !selectedServiceItem?.title ||
                            !selectedServiceItem?.imageUrl ||
                            !selectedServiceItem?.price
                          }
                        >
                          {createServiceMutation.isPending && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          Create
                        </Button>
                      )}
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingServices ? (
                <div className="flex items-center justify-center h-40">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : servicesData && servicesData.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Image</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Order</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-32">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {servicesData.map((item: ServiceItem) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-16 h-16 object-cover rounded"
                          />
                        </TableCell>
                        <TableCell>{item.title}</TableCell>
                        <TableCell>{item.price}</TableCell>
                        <TableCell>{item.order}</TableCell>
                        <TableCell>
                          {item.active ? (
                            <span className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                              Active
                            </span>
                          ) : (
                            <span className="flex items-center">
                              <XCircle className="h-4 w-4 text-red-500 mr-1" />
                              Inactive
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedServiceItem(item);
                                setIsServiceDialogOpen(true);
                              }}
                            >
                              <PencilIcon className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteService(item.id)}
                              disabled={deleteServiceMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <Alert>
                  <AlertTitle>No services found</AlertTitle>
                  <AlertDescription>
                    You haven't added any services yet. Click "Add New Service" to get started.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Testimonials Tab */}
        <TabsContent value="testimonials">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Client Love</CardTitle>
                  <CardDescription>Manage testimonials displayed on the website</CardDescription>
                </div>
                <Dialog open={isTestimonialDialogOpen} onOpenChange={setIsTestimonialDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      onClick={() => {
                        setSelectedTestimonialItem({
                          id: 0,
                          quote: "",
                          name: "",
                          role: "",
                          order: 1,
                          active: true,
                          createdAt: new Date().toISOString(),
                          updatedAt: new Date().toISOString(),
                        });
                      }}
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add New Testimonial
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[625px]">
                    <DialogHeader>
                      <DialogTitle>
                        {selectedTestimonialItem?.id ? "Edit Testimonial" : "Add New Testimonial"}
                      </DialogTitle>
                      <DialogDescription>
                        {selectedTestimonialItem?.id
                          ? "Update the testimonial details."
                          : "Add a new testimonial to your website."}
                      </DialogDescription>
                    </DialogHeader>
                    {selectedTestimonialItem && (
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="quote" className="text-right">
                            Quote
                          </Label>
                          <Textarea
                            id="quote"
                            className="col-span-3"
                            placeholder="Enter testimonial quote"
                            value={selectedTestimonialItem.quote}
                            onChange={(e) =>
                              setSelectedTestimonialItem({
                                ...selectedTestimonialItem,
                                quote: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="name" className="text-right">
                            Name
                          </Label>
                          <Input
                            id="name"
                            className="col-span-3"
                            placeholder="Enter client name"
                            value={selectedTestimonialItem.name}
                            onChange={(e) =>
                              setSelectedTestimonialItem({
                                ...selectedTestimonialItem,
                                name: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="role" className="text-right">
                            Role
                          </Label>
                          <Input
                            id="role"
                            className="col-span-3"
                            placeholder="Enter client role or location"
                            value={selectedTestimonialItem.role}
                            onChange={(e) =>
                              setSelectedTestimonialItem({
                                ...selectedTestimonialItem,
                                role: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="order" className="text-right">
                            Order
                          </Label>
                          <Input
                            id="order"
                            type="number"
                            className="col-span-3"
                            min="1"
                            value={selectedTestimonialItem.order}
                            onChange={(e) =>
                              setSelectedTestimonialItem({
                                ...selectedTestimonialItem,
                                order: parseInt(e.target.value) || 1,
                              })
                            }
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="active" className="text-right">
                            Status
                          </Label>
                          <div className="col-span-3 flex items-center space-x-2">
                            <Switch
                              id="active"
                              checked={selectedTestimonialItem.active}
                              onCheckedChange={(checked) =>
                                setSelectedTestimonialItem({
                                  ...selectedTestimonialItem,
                                  active: checked,
                                })
                              }
                            />
                            <Label htmlFor="active">Active</Label>
                          </div>
                        </div>
                      </div>
                    )}
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsTestimonialDialogOpen(false)}>
                        Cancel
                      </Button>
                      {selectedTestimonialItem?.id ? (
                        <Button
                          onClick={handleUpdateTestimonial}
                          disabled={
                            updateTestimonialMutation.isPending ||
                            !selectedTestimonialItem.quote ||
                            !selectedTestimonialItem.name
                          }
                        >
                          {updateTestimonialMutation.isPending && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          Update
                        </Button>
                      ) : (
                        <Button
                          onClick={handleCreateTestimonial}
                          disabled={
                            createTestimonialMutation.isPending ||
                            !selectedTestimonialItem?.quote ||
                            !selectedTestimonialItem?.name
                          }
                        >
                          {createTestimonialMutation.isPending && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          Create
                        </Button>
                      )}
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingTestimonials ? (
                <div className="flex items-center justify-center h-40">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : testimonialsData && testimonialsData.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Quote</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Order</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-32">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {testimonialsData.map((item: TestimonialItem) => (
                      <TableRow key={item.id}>
                        <TableCell className="max-w-xs truncate">{item.quote}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.role}</TableCell>
                        <TableCell>{item.order}</TableCell>
                        <TableCell>
                          {item.active ? (
                            <span className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                              Active
                            </span>
                          ) : (
                            <span className="flex items-center">
                              <XCircle className="h-4 w-4 text-red-500 mr-1" />
                              Inactive
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedTestimonialItem(item);
                                setIsTestimonialDialogOpen(true);
                              }}
                            >
                              <PencilIcon className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteTestimonial(item.id)}
                              disabled={deleteTestimonialMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <Alert>
                  <AlertTitle>No testimonials found</AlertTitle>
                  <AlertDescription>
                    You haven't added any testimonials yet. Click "Add New Testimonial" to get started.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}