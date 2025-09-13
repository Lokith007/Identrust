
import React, { useState, useEffect } from "react";
import { Credential} from "../Entities/Credentials";
import {  Identity } from "../Entities/Identies";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import {
  Wallet as WalletIcon, // Renamed to avoid conflict with the component name
  Shield,
  QrCode,
  Download,
  Eye,
  EyeOff,
  Filter,
  Search,
  Plus,
  Calendar,
  Building2
} from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const credentialTypeIcons = {
  citizenship: "🏛️",
  education: "🎓",
  employment: "💼",
  healthcare: "🏥",
  banking: "🏦",
  voting_eligibility: "🗳️"
};

const credentialColors = {
  citizenship: "from-blue-500 to-blue-700",
  education: "from-green-500 to-green-700",
  employment: "from-purple-500 to-purple-700",
  healthcare: "from-red-500 to-red-700",
  banking: "from-yellow-500 to-yellow-700",
  voting_eligibility: "from-indigo-500 to-indigo-700"
};

export default function Wallet() {
  const [credentials, setCredentials] = useState([]);
  const [identity, setIdentity] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [showPrivateData, setShowPrivateData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadWalletData();
  }, []);

  const loadWalletData = async () => {
    setIsLoading(true);
    try {
      const credentialsData = await Credential.list('-created_date');
      const identityData = await Identity.list();

      setCredentials(credentialsData);
      setIdentity(identityData[0] || null);
    } catch (error) {
      console.error("Error loading wallet data:", error);
    }
    setIsLoading(false);
  };

  const filteredCredentials = credentials.filter(credential => {
    const matchesSearch = credential.issuer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         credential.credential_type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || credential.credential_type === selectedType;

    return matchesSearch && matchesType;
  });

  const togglePrivateData = (credentialId) => {
    setShowPrivateData(prev => ({
      ...prev,
      [credentialId]: !prev[credentialId]
    }));
  };

  const generateQRCode = (credential) => {
    // Simulate QR code generation for offline verification
    const qrData = {
      id: credential.id,
      type: credential.credential_type,
      issuer: credential.issuer_name,
      hash: credential.verification_hash,
      timestamp: Date.now()
    };

    return `data:image/svg+xml;base64,${btoa(`
      <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="white"/>
        <rect x="20" y="20" width="160" height="160" fill="black"/>
        <rect x="40" y="40" width="120" height="120" fill="white"/>
        <text x="100" y="105" text-anchor="middle" font-family="monospace" font-size="12" fill="black">
          QR Code
        </text>
        <text x="100" y="125" text-anchor="middle" font-family="monospace" font-size="8" fill="black">
          ${credential.credential_type}
        </text>
      </svg>
    `)}`;
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <WalletIcon className="w-8 h-8 text-blue-600" />
            Digital Identity Wallet
          </h1>
          <p className="text-slate-600 mt-1">
            Manage your self-sovereign credentials securely
          </p>
        </div>
        <Link to={createPageUrl("Issue")}>
          <Button className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Credential
          </Button>
        </Link>
      </div>

      {/* Identity Overview */}
      {identity && (
        <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full flex items-center justify-center">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">
                    {identity.full_name}
                  </h3>
                  <p className="text-slate-600">{identity.nationality}</p>
                  <Badge className="mt-2 bg-green-100 text-green-800">
                    {identity.verification_level} Verified
                  </Badge>
                </div>
              </div>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-slate-600">Wallet Address</p>
                  <p className="font-mono text-xs text-slate-800 break-all">
                    {identity.wallet_address}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Identity Hash</p>
                  <p className="font-mono text-xs text-slate-800 break-all">
                    {identity.identity_hash || "Generating..."}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search credentials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-md text-sm"
          >
            <option value="all">All Types</option>
            <option value="citizenship">Citizenship</option>
            <option value="education">Education</option>
            <option value="employment">Employment</option>
            <option value="healthcare">Healthcare</option>
            <option value="banking">Banking</option>
            <option value="voting_eligibility">Voting</option>
          </select>
        </div>
      </div>

      {/* Credentials Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCredentials.map((credential) => {
          const issueDate = new Date(credential.issue_date);
          const formattedIssueDate = !isNaN(issueDate.getTime()) ? format(issueDate, "MMM dd, yyyy") : 'Invalid Date';

          const expiryDate = new Date(credential.expiry_date);
          const formattedExpiryDate = !isNaN(expiryDate.getTime()) ? format(expiryDate, "MMM dd, yyyy") : 'Invalid Date';

          const cardColor = credentialColors[credential.credential_type] || 'from-gray-300 to-gray-500';
          const cardIcon = credentialTypeIcons[credential.credential_type] || '❓';

          return (
            <Card key={credential.id} className="relative overflow-hidden hover:shadow-lg transition-all duration-300 group">
              <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${cardColor}`} />

              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {cardIcon}
                    </span>
                    <div>
                      <CardTitle className="text-lg capitalize">
                        {credential.credential_type.replace(/_/g, ' ')}
                      </CardTitle>
                      <p className="text-sm text-slate-600 flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        {credential.issuer_name}
                      </p>
                    </div>
                  </div>
                  <Badge
                    className={
                      credential.status === 'active'
                        ? 'bg-green-100 text-green-800 border-green-200'
                        : credential.status === 'expired'
                        ? 'bg-red-100 text-red-800 border-red-200'
                        : 'bg-gray-100 text-gray-800 border-gray-200'
                    }
                  >
                    {credential.status}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-500">Issue Date</p>
                    <p className="font-medium flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formattedIssueDate}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500">Expires</p>
                    <p className="font-medium">
                      {credential.expiry_date
                        ? formattedExpiryDate
                        : "Never"
                      }
                    </p>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-slate-500">Verification Hash</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => togglePrivateData(credential.id)}
                      className="h-6 px-2"
                    >
                      {showPrivateData[credential.id] ? (
                        <EyeOff className="w-3 h-3" />
                      ) : (
                        <Eye className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                  <p className="font-mono text-xs bg-slate-50 p-2 rounded break-all">
                    {showPrivateData[credential.id]
                      ? credential.verification_hash || "hash123abc456def789"
                      : "•••••••••••••••••••"
                    }
                  </p>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs"
                    onClick={() => {
                      const qrUrl = generateQRCode(credential);
                      const link = document.createElement('a');
                      link.href = qrUrl;
                      link.download = `${credential.credential_type}-qr.svg`;
                      link.click();
                    }}
                  >
                    <QrCode className="w-3 h-3 mr-1" />
                    QR Code
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs"
                  >
                    <Download className="w-3 h-3 mr-1" />
                    Export
                  </Button>
                </div>

                <div className="text-xs text-slate-500 bg-slate-50 p-2 rounded">
                  <div className="flex justify-between">
                    <span>Verifications: {credential.verification_count ?? 0}</span>
                    <span>Privacy: {credential.privacy_level ?? 'N/A'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredCredentials.length === 0 && !isLoading && (
        <Card className="py-12">
          <CardContent className="text-center">
            <WalletIcon className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              No Credentials Found
            </h3>
            <p className="text-slate-600 mb-4">
              {searchTerm || selectedType !== "all"
                ? "Try adjusting your search or filters"
                : "Start building your digital identity by adding credentials"
              }
            </p>
            <Link to={createPageUrl("Issue")}>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Credential
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
