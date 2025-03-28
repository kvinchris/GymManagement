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
import { ArrowLeft, Download, Printer } from "lucide-react";
import { Member } from "@/types/member";

interface MemberQRCodeProps {
  member: Member;
  onBack: () => void;
}

const MemberQRCode = ({ member, onBack }: MemberQRCodeProps) => {
  // Generate QR code URL - in a real app, you would use a QR code library
  // For this example, we'll use a placeholder QR code service
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    `MEMBER:${member.memberId}`,
  )}`;

  // Function to download QR code
  const downloadQRCode = () => {
    const link = document.createElement("a");
    link.href = qrCodeUrl;
    link.download = `${member.memberId}_qrcode.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Function to print QR code
  const printQRCode = () => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Member QR Code - ${member.name}</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                text-align: center;
                padding: 20px;
              }
              .container {
                max-width: 400px;
                margin: 0 auto;
                border: 1px solid #ccc;
                padding: 20px;
                border-radius: 8px;
              }
              img {
                max-width: 200px;
                height: auto;
              }
              .member-info {
                margin-top: 20px;
                text-align: left;
              }
              .member-info p {
                margin: 5px 0;
              }
              .member-id {
                font-size: 18px;
                font-weight: bold;
              }
              @media print {
                button {
                  display: none;
                }
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h2>Gym Membership Card</h2>
              <img src="${qrCodeUrl}" alt="Member QR Code" />
              <div class="member-info">
                <p class="member-id">ID: ${member.memberId}</p>
                <p><strong>Name:</strong> ${member.name}</p>
                <p><strong>Package:</strong> ${member.packageName}</p>
                <p><strong>Expiry:</strong> ${member.expiryDate.toLocaleDateString()}</p>
              </div>
            </div>
            <button onclick="window.print();" style="margin-top: 20px; padding: 10px 20px;">Print</button>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <div className="space-y-6">
      <Button variant="outline" onClick={onBack} className="gap-2">
        <ArrowLeft className="h-4 w-4" /> Back
      </Button>

      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle>Member QR Code</CardTitle>
          <CardDescription>Scan this code for quick check-in</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <div className="border p-4 rounded-lg bg-white">
            <img src={qrCodeUrl} alt="Member QR Code" className="w-48 h-48" />
          </div>

          <div className="mt-6 w-full space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-500">
                Member ID:
              </span>
              <span className="font-medium">{member.memberId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-500">Name:</span>
              <span>{member.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-500">
                Package:
              </span>
              <span>{member.packageName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-500">
                Expiry Date:
              </span>
              <span>
                {member.expiryDate.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={downloadQRCode} className="gap-2">
            <Download className="h-4 w-4" /> Download
          </Button>
          <Button onClick={printQRCode} className="gap-2">
            <Printer className="h-4 w-4" /> Print Card
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default MemberQRCode;
