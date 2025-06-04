'use client';
import { AppSidebar } from '@/components/app-sidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
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
import { ContractsListV2 } from '@/components/page/ContractsListV2';
import { TempUserControl } from '@/components/temp-usercontrol';
import { UserBalance } from '@/components/user-balance';
import { SocialChat } from '@/components/page/SocialChat';
import { FakeNews } from '@/components/page/FakeNews';
import { TeamCalendar } from '@/components/page/TeamCalendar';
import { Suspense, useState } from 'react';
import { OrderBook } from '@/components/page/OrderBook';
import { History } from '@/components/page/History';
import { Positions } from '@/components/page/Positions';
import { MainGraph } from '@/components/page/MainGraph';
import { BuySellSheet } from '@/components/page/buy-sell-sheet';
import { ContractTransactions } from '@/components/page/ContractTransactions';
import { UserContractTransactions } from '@/components/page/UserContractTransactions';
import { Contracts } from '@/lib/types';
import { BestOrderBook } from '@/components/page/BestOrderBook';

export function HomePageComponent() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState<Contracts | null>(null);
  const [actionType, setActionType] = useState<'buy' | 'sell' | null>(null);

  const handleBuy = (contract: Contracts) => {
    setSelectedContract(contract);
    setActionType('buy');
    setSheetOpen(true);
  };
  const handleSell = (contract: Contracts) => {
    setSelectedContract(contract);
    setActionType('sell');
    setSheetOpen(true);
  };

  return (
    <Suspense fallback={null}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex items-center h-16 px-4 gap-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <SidebarTrigger className="-ml-1" />
            <Suspense fallback={null}>
              <UserBalance />
            </Suspense>
            <Suspense fallback={null}>
              <TempUserControl />
            </Suspense>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  <Avatar className="size-12">
                    <AvatarImage src="https://source.unsplash.com/random/48x48?face" alt="User" />
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
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0 h-full min-h-0">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Markets</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Football</BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>NFL</BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage> 2023 Season Total Wins (incl playoffs)</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1 h-full min-h-0">
              {/* Left Column - 1/3 width */}
              <div className="md:col-span-1 flex flex-col h-full min-h-0">
                <div className="rounded-xl bg-muted/50 p-2 flex flex-col h-full min-h-0 overflow-auto">
                  <Suspense fallback={null}>
                    <ContractsListV2 onBuy={handleBuy} onSell={handleSell} />
                  </Suspense>
                </div>
              </div>

              {/* Right Column - 2/3 width */}
              <div className="md:col-span-3 flex flex-col gap-4">
                <MainGraph />

                {/* Bottom Section - Tabs */}
                <div className="rounded-xl bg-muted/50">
                  <Tabs defaultValue="open-trades" className="w-full">
                    <TabsList className="w-full justify-start">
                      <TabsTrigger className="text-red-400!" value="position">
                        Position
                      </TabsTrigger>
                      <TabsTrigger value="orders">Orders</TabsTrigger>
                      <TabsTrigger value="history">History</TabsTrigger>
                      <TabsTrigger value="transactions">Transactions</TabsTrigger>
                      <TabsTrigger value="user-transactions">User Transactions</TabsTrigger>
                      <TabsTrigger value="best-order-book">Best Order Book</TabsTrigger>
                      <TabsTrigger value="social">Social</TabsTrigger>
                      <TabsTrigger value="news">News</TabsTrigger>
                      <TabsTrigger value="calendar">Calendar</TabsTrigger>
                    </TabsList>
                    <div className="p-4">
                      <TabsContent value="position">
                        <Positions />
                      </TabsContent>
                      <TabsContent value="orders">
                        <Suspense fallback={null}>
                          <OrderBook />
                        </Suspense>
                      </TabsContent>
                      <TabsContent value="history">
                        <History />
                      </TabsContent>
                      <TabsContent value="transactions">
                        <ContractTransactions />
                      </TabsContent>
                      <TabsContent value="user-transactions">
                        <Suspense fallback={null}>
                          <UserContractTransactions />
                        </Suspense>
                      </TabsContent>
                      <TabsContent value="best-order-book">
                        <Suspense fallback={null}>
                          <BestOrderBook />
                        </Suspense>
                      </TabsContent>
                      <TabsContent value="social">
                        <SocialChat />
                      </TabsContent>
                      <TabsContent value="news">
                        <FakeNews />
                      </TabsContent>
                      <TabsContent value="calendar">
                        <TeamCalendar />
                      </TabsContent>
                    </div>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
          <BuySellSheet
            open={sheetOpen}
            onOpenChange={setSheetOpen}
            contract={selectedContract}
            actionType={actionType}
          />
        </SidebarInset>
      </SidebarProvider>
    </Suspense>
  );
}

export default HomePageComponent;
