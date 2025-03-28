import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Edit, MoreHorizontal, Plus, Search, Trash2 } from "lucide-react";
import { Package } from "@/types/package";

interface PackageListProps {
  packages: Package[];
  onAddPackage: () => void;
  onEditPackage: (pkg: Package) => void;
  onDeletePackage: (packageId: string) => void;
  onViewPackage: (pkg: Package) => void;
}

const PackageList = ({
  packages,
  onAddPackage,
  onEditPackage,
  onDeletePackage,
  onViewPackage,
}: PackageListProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter packages based on search query
  const filteredPackages = packages.filter(
    (pkg) =>
      pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="w-full bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search packages..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={onAddPackage} className="whitespace-nowrap">
          <Plus className="h-4 w-4 mr-2" /> Add Package
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Features</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPackages.length > 0 ? (
              filteredPackages.map((pkg) => (
                <TableRow key={pkg.id} className="hover:bg-gray-50">
                  <TableCell
                    className="font-medium cursor-pointer"
                    onClick={() => onViewPackage(pkg)}
                  >
                    {pkg.name}
                  </TableCell>
                  <TableCell>{pkg.description}</TableCell>
                  <TableCell>${pkg.price.toFixed(2)}</TableCell>
                  <TableCell>
                    {pkg.duration} {pkg.duration === 1 ? "day" : "days"}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {pkg.features.slice(0, 2).map((feature, index) => (
                        <Badge key={index} variant="outline" className="mr-1">
                          {feature}
                        </Badge>
                      ))}
                      {pkg.features.length > 2 && (
                        <Badge variant="outline">
                          +{pkg.features.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onViewPackage(pkg)}>
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEditPackage(pkg)}>
                          <Edit className="h-4 w-4 mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => onDeletePackage(pkg.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-6 text-gray-500"
                >
                  {searchQuery
                    ? "No packages found matching your search."
                    : "No packages added yet."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PackageList;
