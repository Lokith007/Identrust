
import React, { useState, useEffect } from "react";
import { Credential } from "../entities/Identies";
import { Institution } from "../entities/Institution";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Badge } from "../components/ui/badge";
import { 
  Building2, 
  Shield,
  Plus,
  CheckCircle2,
  Calendar,
  Hash,
  QrCode,
  Download
} from "lucide-react";
import { format } from "date-fns";

export default function Issue() {
  const [formData, setFormData] = useState({
    credential_type: "",
    issuer_name: "",
    issuer_type: "",
    credential_data: "",
    issue_date: format(new Date(), 'yyyy-MM-dd'),
    expiry_date: "",
    privacy_level: "selective"
  });
  const [institutions, setInstitutions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [issuedCredential, setIssuedCredential] = useState(null);

  useEffect(() => {
    loadInstitutions();
  }, []);

  const loadInstitutions = async () => {
    try {
      const institutionData = await Institution.list();
      setInstitutions(institutionData);
    } catch (error) {
      console.error("Error loading institutions:", error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateVerificationHash = (data) => {
    // Simulate blockchain hash generation
    const hashString = JSON.stringify(data) + Date.now();
    return `0x${hashString.split('').reduce((hash, char) => {
      const charCode = char.charCodeAt(0);
      return ((hash << 5) - hash + charCode) & 0xffffffff;
    }, 0).toString(16).padStart(8, '0')}`;
  };

  const generateQRCode = (credential) => {
    // Generate QR code data
    const qrData = {
      id: credential.id,
      type: credential.credential_type,
      issuer: credential.issuer_name,
      hash: credential.verification_hash,
      expires: credential.expiry_date
    };
    
    return JSON.stringify(qrData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const verificationHash = generateVerificationHash(formData);
      
      const credentialPayload = {
        ...formData,
        credential_data: { details: formData.credential_data || "" }, // Changed
        verification_hash: verificationHash,
        status: 'active',
        verification_count: 0
      };

      const newCredential = await Credential.create(credentialPayload); // Changed
      
      // Generate QR code
      const qrCode = generateQRCode(newCredential);
      await Credential.update(newCredential.id, { qr_code: qrCode });

      setIssuedCredential({
        ...newCredential,
        qr_code: qrCode
      });

      // Reset form
      setFormData({
        credential_type: "",
        issuer_name: "",
        issuer_type: "",
        credential_data: "",
        issue_date: format(new Date(), 'yyyy-MM-dd'),
        expiry_date: "",
        privacy_level: "selective"
      });

    } catch (error) {
      console.error("Error issuing credential:", error);
    }

    setIsSubmitting(false);
  };

  const credentialTypes = [
    { value: "citizenship", label: "Citizenship Certificate" },
    { value: "education", label: "Educational Qualification" },
    { value: "employment", label: "Employment Verification" },
    { value: "healthcare", label: "Healthcare Record" },
    { value: "banking", label: "Banking/KYC Certificate" },
    { value: "voting_eligibility", label: "Voting Eligibility" }
  ];

  const issuerTypes = [
    { value: "government", label: "Government Agency" },
    { value: "university", label: "Educational Institution" },
    { value: "bank", label: "Financial Institution" },
    { value: "hospital", label: "Healthcare Provider" },
    { value: "employer", label: "Employer/Company" },
    { value: "certification_body", label: "Certification Body" }
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Building2 className="w-8 h-8 text-blue-600" />
            Issue Credentials
          </h1>
          <p className="text-slate-600 mt-1">
            Create and issue verifiable digital credentials
          </p>
        </div>
        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
          <Shield className="w-3 h-3 mr-1" />
          Institution Dashboard
        </Badge>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Credential Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                New Credential
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="credential_type">Credential Type</Label>
                    <Select
                      value={formData.credential_type}
                      onValueChange={(value) => handleInputChange('credential_type', value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select credential type" />
                      </SelectTrigger>
                      <SelectContent>
                        {credentialTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="issuer_type">Issuer Type</Label>
                    <Select
                      value={formData.issuer_type}
                      onValueChange={(value) => handleInputChange('issuer_type', value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select issuer type" />
                      </SelectTrigger>
                      <SelectContent>
                        {issuerTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="issuer_name">Issuer Name</Label>
                  <Input
                    id="issuer_name"
                    value={formData.issuer_name}
                    onChange={(e) => handleInputChange('issuer_name', e.target.value)}
                    placeholder="Name of issuing organization"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="credential_data">Credential Details</Label>
                  <Textarea
                    id="credential_data"
                    value={formData.credential_data}
                    onChange={(e) => handleInputChange('credential_data', e.target.value)}
                    placeholder="Enter credential details, achievements, or qualifications..."
                    rows={4}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="issue_date">Issue Date</Label>
                    <Input
                      id="issue_date"
                      type="date"
                      value={formData.issue_date}
                      onChange={(e) => handleInputChange('issue_date', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expiry_date">Expiry Date (Optional)</Label>
                    <Input
                      id="expiry_date"
                      type="date"
                      value={formData.expiry_date}
                      onChange={(e) => handleInputChange('expiry_date', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="privacy_level">Privacy Level</Label>
                  <Select
                    value={formData.privacy_level}
                    onValueChange={(value) => handleInputChange('privacy_level', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select privacy level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public - All data visible</SelectItem>
                      <SelectItem value="selective">Selective - User controls disclosure</SelectItem>
                      <SelectItem value="private">Private - Minimal disclosure only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Issuing Credential..." : "Issue Credential"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Success Display */}
        <div className="space-y-6">
          {issuedCredential ? (
            <Card className="border-2 border-green-300 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <CheckCircle2 className="w-6 h-6" />
                  Credential Issued Successfully
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-green-700 font-medium">Credential Type</p>
                  <p className="text-green-900 capitalize">
                    {issuedCredential.credential_type?.replace(/_/g, ' ')}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-green-700 font-medium">Issuer</p>
                  <p className="text-green-900">{issuedCredential.issuer_name}</p>
                </div>

                <div>
                  <p className="text-sm text-green-700 font-medium">Verification Hash</p>
                  <p className="font-mono text-xs text-green-800 bg-green-100 p-2 rounded break-all">
                    {issuedCredential.verification_hash}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline" 
                    className="flex-1 text-xs"
                  >
                    <QrCode className="w-3 h-3 mr-1" />
                    QR Code
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 text-xs"
                  >
                    <Download className="w-3 h-3 mr-1" />
                    Export
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hash className="w-5 h-5" />
                  Blockchain Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">Tamper-Proof</p>
                    <p className="text-xs text-slate-600">Secured by Base44 blockchain</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Shield className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">Cryptographic Hash</p>
                    <p className="text-xs text-slate-600">Unique verification signature</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <QrCode className="w-4 h-4 text-purple-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">Offline QR Code</p>
                    <p className="text-xs text-slate-600">Works without internet</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 text-orange-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">Expiry Management</p>
                    <p className="text-xs text-slate-600">Automatic lifecycle tracking</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Trusted Institutions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Trusted Network
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-700 font-semibold text-xs">GV</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">Government Verifier</p>
                    <p className="text-xs text-slate-600">Citizenship & Legal</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800 text-xs">Verified</Badge>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-700 font-semibold text-xs">ED</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">Education Consortium</p>
                    <p className="text-xs text-slate-600">Academic Credentials</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800 text-xs">Verified</Badge>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-700 font-semibold text-xs">HC</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">Healthcare Network</p>
                    <p className="text-xs text-slate-600">Medical Records</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800 text-xs">Verified</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
