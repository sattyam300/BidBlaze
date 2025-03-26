import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Clock, 
  Package, 
  BarChart3, 
  Heart, 
  Settings, 
  LogOut, 
  ShoppingBag,
  AlertCircle
} from "lucide-react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

// Mock data for demonstration purposes
const userInfo = {
  name: "John Doe",
  email: "john.doe@example.com",
  accountType: "User",
  memberSince: "January 2023",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
};

const myOrders = [
  { 
    id: "ORD-7829", 
    item: "Vintage Rolex Watch", 
    date: "2023-06-15", 
    status: "Delivered", 
    amount: "$4,250.00",
    image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=300&h=200"
  },
  { 
    id: "ORD-6543", 
    item: "Art Deco Painting", 
    date: "2023-05-22", 
    status: "Shipped", 
    amount: "$1,850.00",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=300&h=200"
  },
  { 
    id: "ORD-5421", 
    item: "Antique Desk Lamp", 
    date: "2023-04-10", 
    status: "Delivered", 
    amount: "$320.00",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=300&h=200"
  }
];

const myBids = [
  { 
    id: "BID-8932", 
    item: "Rare Comic Book Collection", 
    date: "2023-06-10", 
    status: "Winning", 
    bidAmount: "$1,250.00",
    currentBid: "$1,250.00",
    endsIn: "2 days",
    image: "https://images.unsplash.com/photo-1544982503-9f984c14501a?auto=format&fit=crop&q=80&w=300&h=200"
  },
  { 
    id: "BID-7651", 
    item: "Japanese Porcelain Set", 
    date: "2023-06-05", 
    status: "Outbid", 
    bidAmount: "$450.00",
    currentBid: "$520.00",
    endsIn: "6 hours",
    image: "https://images.unsplash.com/photo-1626806787461-102c1a7f1c0b?auto=format&fit=crop&q=80&w=300&h=200"
  },
  { 
    id: "BID-6472", 
    item: "Handcrafted Leather Bag", 
    date: "2023-05-30", 
    status: "Won", 
    bidAmount: "$380.00",
    currentBid: "$380.00",
    endsIn: "Ended",
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=300&h=200"
  }
];

const recommendedAuctions = [
  {
    id: "AUC-9821",
    title: "Mid-Century Modern Chair",
    currentBid: "$320",
    endsIn: "1 day",
    image: "https://images.unsplash.com/photo-1561677978-583a8c7a4b43?auto=format&fit=crop&q=80&w=300&h=200"
  },
  {
    id: "AUC-8754",
    title: "Vintage Camera Collection",
    currentBid: "$750",
    endsIn: "3 days",
    image: "https://images.unsplash.com/photo-1452780212940-6f5c0d14d848?auto=format&fit=crop&q=80&w=300&h=200"
  },
  {
    id: "AUC-7653",
    title: "Handmade Pottery Set",
    currentBid: "$180",
    endsIn: "8 hours",
    image: "https://images.unsplash.com/photo-1565193298357-ada3abf71a43?auto=format&fit=crop&q=80&w=300&h=200"
  },
  {
    id: "AUC-6452",
    title: "Limited Edition Prints",
    currentBid: "$420",
    endsIn: "2 days",
    image: "https://images.unsplash.com/photo-1579541637431-4e3cd6f6c9e3?auto=format&fit=crop&q=80&w=300&h=200"
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Delivered":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "Shipped":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case "Winning":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "Outbid":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    case "Won":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  }
};

const Profile = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const navigate = useNavigate();
  
  const handleLogout = () => {
    // Simulate logout process
    toast.success("You've been successfully logged out");
    
    // Navigate to home page after logout
    setTimeout(() => {
      navigate("/");
    }, 1500);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Profile Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <div className="p-6 text-center border-b border-gray-200 dark:border-gray-700">
                  <Avatar className="h-24 w-24 mx-auto mb-4">
                    <AvatarImage src={userInfo.avatar} alt={userInfo.name} />
                    <AvatarFallback>{userInfo.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-bold">{userInfo.name}</h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{userInfo.email}</p>
                  <Badge className="mt-2">{userInfo.accountType}</Badge>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Member since {userInfo.memberSince}
                  </p>
                </div>
                
                <div className="p-4">
                  <nav className="space-y-2">
                    <Button 
                      variant={activeTab === "overview" ? "default" : "ghost"} 
                      className="w-full justify-start" 
                      onClick={() => setActiveTab("overview")}
                    >
                      <BarChart3 className="mr-2 h-4 w-4" /> Overview
                    </Button>
                    <Button 
                      variant={activeTab === "orders" ? "default" : "ghost"} 
                      className="w-full justify-start" 
                      onClick={() => setActiveTab("orders")}
                    >
                      <ShoppingBag className="mr-2 h-4 w-4" /> My Orders
                    </Button>
                    <Button 
                      variant={activeTab === "bids" ? "default" : "ghost"} 
                      className="w-full justify-start" 
                      onClick={() => setActiveTab("bids")}
                    >
                      <Clock className="mr-2 h-4 w-4" /> My Bids
                    </Button>
                    <Button 
                      variant={activeTab === "recommended" ? "default" : "ghost"} 
                      className="w-full justify-start" 
                      onClick={() => setActiveTab("recommended")}
                    >
                      <Heart className="mr-2 h-4 w-4" /> Recommended
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-gray-500 dark:text-gray-400"
                    >
                      <Settings className="mr-2 h-4 w-4" /> Settings
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                      onClick={() => setLogoutDialogOpen(true)}
                    >
                      <LogOut className="mr-2 h-4 w-4" /> Sign out
                    </Button>
                  </nav>
                </div>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="lg:col-span-3">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-4 mb-6">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="orders">My Orders</TabsTrigger>
                  <TabsTrigger value="bids">My Bids</TabsTrigger>
                  <TabsTrigger value="recommended">Recommended</TabsTrigger>
                </TabsList>
                
                {/* Overview Tab */}
                <TabsContent value="overview">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <ShoppingBag className="mr-2 h-5 w-5 text-primary" />
                          Recent Orders
                        </CardTitle>
                        <CardDescription>Your latest purchases</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {myOrders.slice(0, 2).map((order) => (
                          <div key={order.id} className="flex items-center gap-4 mb-4 last:mb-0">
                            <img 
                              src={order.image} 
                              alt={order.item} 
                              className="w-12 h-12 rounded-md object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{order.item}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{order.id} • {order.date}</p>
                            </div>
                            <Badge className={getStatusColor(order.status)}>
                              {order.status}
                            </Badge>
                          </div>
                        ))}
                        <Button variant="ghost" size="sm" className="w-full mt-2">
                          View all orders
                        </Button>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Clock className="mr-2 h-5 w-5 text-primary" />
                          Active Bids
                        </CardTitle>
                        <CardDescription>Your ongoing auction bids</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {myBids.slice(0, 2).map((bid) => (
                          <div key={bid.id} className="flex items-center gap-4 mb-4 last:mb-0">
                            <img 
                              src={bid.image} 
                              alt={bid.item} 
                              className="w-12 h-12 rounded-md object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{bid.item}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Your bid: {bid.bidAmount}</p>
                            </div>
                            <Badge className={getStatusColor(bid.status)}>
                              {bid.status}
                            </Badge>
                          </div>
                        ))}
                        <Button variant="ghost" size="sm" className="w-full mt-2">
                          View all bids
                        </Button>
                      </CardContent>
                    </Card>
                    
                    <Card className="md:col-span-2">
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Heart className="mr-2 h-5 w-5 text-primary" />
                          Recommended for You
                        </CardTitle>
                        <CardDescription>Based on your bidding history</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {recommendedAuctions.slice(0, 2).map((auction) => (
                            <div key={auction.id} className="border rounded-lg overflow-hidden group hover:shadow-md transition-shadow">
                              <div className="relative h-40">
                                <img
                                  src={auction.image}
                                  alt={auction.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute bottom-2 right-2">
                                  <Badge className="bg-primary/80 hover:bg-primary text-white">{auction.endsIn}</Badge>
                                </div>
                              </div>
                              <div className="p-3">
                                <h3 className="font-medium text-sm truncate">{auction.title}</h3>
                                <div className="flex justify-between items-center mt-1">
                                  <p className="text-xs text-gray-500 dark:text-gray-400">Current bid</p>
                                  <p className="font-medium text-sm">{auction.currentBid}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <Button variant="ghost" size="sm" className="w-full mt-4">
                          View all recommendations
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                {/* Orders Tab */}
                <TabsContent value="orders">
                  <Card>
                    <CardHeader>
                      <CardTitle>My Orders</CardTitle>
                      <CardDescription>A history of all your auction purchases</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[250px]">Item</TableHead>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {myOrders.map((order) => (
                            <TableRow key={order.id}>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <img
                                    src={order.image}
                                    alt={order.item}
                                    className="w-10 h-10 rounded object-cover"
                                  />
                                  <span className="font-medium">{order.item}</span>
                                </div>
                              </TableCell>
                              <TableCell>{order.id}</TableCell>
                              <TableCell>{order.date}</TableCell>
                              <TableCell>
                                <Badge className={getStatusColor(order.status)}>
                                  {order.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">{order.amount}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Bids Tab */}
                <TabsContent value="bids">
                  <Card>
                    <CardHeader>
                      <CardTitle>My Bids</CardTitle>
                      <CardDescription>Track your active and past bids</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[250px]">Item</TableHead>
                            <TableHead>Bid ID</TableHead>
                            <TableHead>Your Bid</TableHead>
                            <TableHead>Current Bid</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Ends In</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {myBids.map((bid) => (
                            <TableRow key={bid.id}>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <img
                                    src={bid.image}
                                    alt={bid.item}
                                    className="w-10 h-10 rounded object-cover"
                                  />
                                  <span className="font-medium">{bid.item}</span>
                                </div>
                              </TableCell>
                              <TableCell>{bid.id}</TableCell>
                              <TableCell>{bid.bidAmount}</TableCell>
                              <TableCell>{bid.currentBid}</TableCell>
                              <TableCell>
                                <Badge className={getStatusColor(bid.status)}>
                                  {bid.status}
                                </Badge>
                              </TableCell>
                              <TableCell>{bid.endsIn}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Recommended Tab */}
                <TabsContent value="recommended">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recommended Auctions</CardTitle>
                      <CardDescription>Based on your bidding history and interests</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                        {recommendedAuctions.map((auction) => (
                          <div key={auction.id} className="border rounded-lg overflow-hidden group hover:shadow-md transition-shadow">
                            <div className="relative h-48">
                              <img
                                src={auction.image}
                                alt={auction.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute bottom-2 right-2">
                                <Badge className="bg-primary/80 hover:bg-primary text-white">{auction.endsIn}</Badge>
                              </div>
                            </div>
                            <div className="p-4">
                              <h3 className="font-medium">{auction.title}</h3>
                              <div className="flex justify-between items-center mt-2">
                                <div>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">Current bid</p>
                                  <p className="font-semibold">{auction.currentBid}</p>
                                </div>
                                <Button size="sm">Place Bid</Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      
      {/* Logout Confirmation Dialog */}
      <AlertDialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to sign out?</AlertDialogTitle>
            <AlertDialogDescription>
              You will be logged out of your BidBlaze account on this device.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout} className="bg-red-500 hover:bg-red-600">
              Sign Out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Profile;
