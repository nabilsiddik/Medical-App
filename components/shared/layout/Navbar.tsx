import Link from "next/link";
import { getLoggedInUser } from "@/services/user/userServices";
import Logo from "@/components/logo";
import LogoutUserButton from "@/components/LogoutUserButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LayoutDashboard,
  User,
  Shield,
  KeyRound,
  ChevronDown,
  ArrowRight,
  Menu,
} from "lucide-react";
import { Button } from "@/components/shared/buttons/Button";
import { UserRole } from "@/types/user.interface";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default async function Navbar() {
  const user = await getLoggedInUser();

  const navigationLinks = [
    { href: "/#chambers", label: "Chambers" },
    { href: "/#services", label: "Services" },
    { href: "/book", label: "Book Appointment" },
    { href: "/#faq", label: "Patient Info" },
  ];

  const getInitials = (name?: string) => {
    if (!name) return "Dr";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const isStaff =
    user?.role === UserRole.ADMIN ||
    user?.role === UserRole.SUPER_ADMIN ||
    user?.role === UserRole.DOCTOR ||
    user?.role === UserRole.RECEPTIONIST;

  const dashboardUrl = isStaff ? "/admin/dashboard" : "/user/dashboard";
  const profileUrl = isStaff ? "/admin/dashboard/settings" : "/user/dashboard/profile";
  const securityUrl = "/admin/dashboard/security";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 transition-all">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left Side: Logo & Main Nav */}
        <div className="flex items-center gap-8">
          <Logo size="md" />

          <nav className="hidden md:flex items-center gap-6">
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right Side: Auth & User Profile */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <Link href={dashboardUrl} className="hidden sm:inline-flex">
                <Button variant="outline" size="sm" leftIcon={<LayoutDashboard className="h-4 w-4" />}>
                  Dashboard
                </Button>
              </Link>

              {/* User Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2.5 p-1.5 rounded-full hover:bg-accent/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer">
                    <Avatar className="h-9 w-9 ring-2 ring-primary/20">
                      <AvatarImage src={user.profilePhoto || undefined} alt={user.fullName} />
                      <AvatarFallback className="bg-gradient-to-tr from-blue-600 to-indigo-600 text-white text-xs font-semibold">
                        {getInitials(user.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden lg:flex flex-col text-left">
                      <span className="text-sm font-medium leading-none text-foreground">
                        {user.fullName}
                      </span>
                      <span className="text-xs text-muted-foreground mt-0.5 capitalize">
                        {user.role?.toLowerCase().replace("_", " ")}
                      </span>
                    </div>
                    <ChevronDown className="h-3.5 w-3.5 text-muted-foreground hidden sm:block" />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-64 p-2" align="end" sideOffset={8}>
                  {/* User Profile Header in Dropdown */}
                  <DropdownMenuLabel className="p-2 font-normal">
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold leading-none text-foreground">
                          {user.fullName}
                        </p>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                            isStaff
                              ? "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300"
                              : "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                          }`}
                        >
                          {user.role}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuGroup>
                    <Link href={dashboardUrl}>
                      <DropdownMenuItem className="cursor-pointer py-2 gap-2">
                        <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
                        <span>Dashboard</span>
                      </DropdownMenuItem>
                    </Link>

                    <Link href={profileUrl}>
                      <DropdownMenuItem className="cursor-pointer py-2 gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>Profile Settings</span>
                      </DropdownMenuItem>
                    </Link>

                    <Link href={securityUrl}>
                      <DropdownMenuItem className="cursor-pointer py-2 gap-2">
                        <KeyRound className="h-4 w-4 text-muted-foreground" />
                        <span>Security & Password</span>
                      </DropdownMenuItem>
                    </Link>

                    {isStaff && (
                      <Link href="/admin/dashboard/users">
                        <DropdownMenuItem className="cursor-pointer py-2 gap-2">
                          <Shield className="h-4 w-4 text-muted-foreground" />
                          <span>User Management</span>
                        </DropdownMenuItem>
                      </Link>
                    )}
                  </DropdownMenuGroup>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem className="p-0 focus:bg-destructive/10">
                    <LogoutUserButton variant="dropdown" />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Staff Login
                </Button>
              </Link>
              <Link href="/book">
                <Button variant="gradient" size="sm" rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>
                  Book Appointment
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Drawer */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <button
                  type="button"
                  aria-label="Open mobile menu"
                  className="inline-flex items-center justify-center rounded-xl p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                >
                  <Menu className="h-5 w-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 p-6 flex flex-col justify-between">
                <div>
                  <SheetHeader className="mb-6">
                    <SheetTitle className="text-left">
                      <Logo size="sm" />
                    </SheetTitle>
                  </SheetHeader>

                  <div className="flex flex-col gap-3">
                    {navigationLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="text-base font-medium py-2 text-foreground/80 hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t">
                  {user ? (
                    <div className="flex flex-col gap-2.5">
                      <div className="flex items-center gap-3 mb-2">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.profilePhoto || undefined} alt={user.fullName} />
                          <AvatarFallback className="bg-primary text-white text-xs font-semibold">
                            {getInitials(user.fullName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col truncate">
                          <span className="text-sm font-semibold text-foreground truncate">{user.fullName}</span>
                          <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                        </div>
                      </div>
                      <Link href={dashboardUrl} className="w-full">
                        <Button variant="outline" className="w-full justify-start gap-2">
                          <LayoutDashboard className="h-4 w-4" />
                          Dashboard
                        </Button>
                      </Link>
                      <LogoutUserButton variant="button" />
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <Link href="/login" className="w-full">
                        <Button variant="outline" className="w-full">
                          Sign In
                        </Button>
                      </Link>
                      <Link href="/signup" className="w-full">
                        <Button variant="gradient" className="w-full">
                          Get Started
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
