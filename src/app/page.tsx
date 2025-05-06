import { AppSidebar } from '@/components/app-sidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Markets</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Sport A</BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>League B</BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Selected Team X</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* Right side header content */}
          <div className="flex items-center gap-4 px-4">
            <div className="hidden md:flex items-center gap-4">
              <div className="text-sm">
                <span className="text-muted-foreground">Balance:</span>
                <span className="ml-1 font-medium">$10,000.00</span>
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">Open P/L:</span>
                <span className="ml-1 font-medium text-green-500">+$1,234.56</span>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  <Avatar className="size-12">
                    <AvatarImage src="/avatars/shadcn.jpg" alt="User" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
            {/* Left Column - 1/3 width */}
            <div className="md:col-span-1">
              <div className="rounded-xl bg-muted/50 h-full p-4">
                <h2 className="text-lg font-semibold mb-4">Contracts</h2>
              </div>
            </div>

            {/* Right Column - 2/3 width */}
            <div className="md:col-span-3 flex flex-col gap-4">
              {/* Top Section - Graph */}
              <div className="rounded-xl bg-muted/50 flex-1" />

              {/* Bottom Section - Tabs */}
              <div className="rounded-xl bg-muted/50">
                <Tabs defaultValue="open-trades" className="w-full">
                  <TabsList className="w-full justify-start">
                    <TabsTrigger value="open-trades">Open Trades</TabsTrigger>
                    <TabsTrigger value="closed-trades">Closed Trades</TabsTrigger>
                    <TabsTrigger value="pending-orders">Pending Orders</TabsTrigger>
                    <TabsTrigger value="summary">Summary</TabsTrigger>
                    <TabsTrigger value="social">Social</TabsTrigger>
                    <TabsTrigger value="news">News</TabsTrigger>
                    <TabsTrigger value="calendar">Calendar</TabsTrigger>
                  </TabsList>
                  <div className="p-4">
                    <TabsContent value="open-trades">
                      <div className="h-48 rounded-lg bg-blue-100 dark:bg-blue-900/20" />
                    </TabsContent>
                    <TabsContent value="closed-trades">
                      <div className="h-48 rounded-lg bg-green-100 dark:bg-green-900/20" />
                    </TabsContent>
                    <TabsContent value="pending-orders">
                      <div className="h-48 rounded-lg bg-yellow-100 dark:bg-yellow-900/20" />
                    </TabsContent>
                    <TabsContent value="summary">
                      <div className="h-48 rounded-lg bg-purple-100 dark:bg-purple-900/20" />
                    </TabsContent>
                    <TabsContent value="social">
                      <div className="h-48 rounded-lg bg-pink-100 dark:bg-pink-900/20" />
                    </TabsContent>
                    <TabsContent value="news">
                      <div className="h-48 rounded-lg bg-orange-100 dark:bg-orange-900/20" />
                    </TabsContent>
                    <TabsContent value="calendar">
                      <div className="h-48 rounded-lg bg-red-100 dark:bg-red-900/20" />
                    </TabsContent>
                  </div>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
