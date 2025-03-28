import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Edit, ArrowLeft, Users } from "lucide-react";
import { Package } from "@/types/package";

interface PackageDetailProps {
  pkg: Package;
  memberCount?: number;
  onBack: () => void;
  onEdit: (pkg: Package) => void;
}

const PackageDetail = ({
  pkg,
  memberCount = 0,
  onBack,
  onEdit,
}: PackageDetailProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Packages
        </Button>
        <Button onClick={() => onEdit(pkg)} className="gap-2">
          <Edit className="h-4 w-4" /> Edit Package
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-2xl">{pkg.name}</CardTitle>
            <CardDescription>{pkg.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Price</p>
                <p className="text-2xl font-bold">${pkg.price.toFixed(2)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Duration</p>
                <p className="text-2xl font-bold">
                  {pkg.duration} {pkg.duration === 1 ? "day" : "days"}
                </p>
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-sm font-medium text-gray-500 mb-3">Features</p>
              <div className="space-y-2">
                {pkg.features.length > 0 ? (
                  pkg.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center p-2 bg-gray-50 rounded-md"
                    >
                      <div className="h-2 w-2 bg-blue-500 rounded-full mr-3"></div>
                      <span>{feature}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">
                    No features listed for this package.
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Package Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">
                Active Members
              </p>
              <div className="flex items-center">
                <Users className="h-5 w-5 text-blue-500 mr-2" />
                <span className="text-2xl font-bold">{memberCount}</span>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">
                Monthly Revenue
              </p>
              <p className="text-2xl font-bold">
                ${(memberCount * pkg.price).toFixed(2)}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Price per Day</p>
              <p className="font-medium">
                ${(pkg.price / pkg.duration).toFixed(2)}/day
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Status</p>
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                Active
              </Badge>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={() => onEdit(pkg)}
            >
              <Edit className="h-4 w-4" /> Edit Package
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default PackageDetail;
