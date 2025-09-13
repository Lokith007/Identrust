import React, { useState, useRef } from "react";
import { Verification, Credential } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  QrCode, 
  Scan,
  CheckCircle2,
  XCircle,
  Camera,
  Upload,
  Shield,
  AlertTriangle,
  Clock,
  Smartphone
} from "lucide-react";
import { format } from "date-fns";

export default function Verify() {
  const [isScanning, setIsScanning] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [manualHash, setManualHash] = useState("");
  const [recentVerifications, setRecentVerifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const simulateQRScan = async () => {
    setIsScanning(true);
    setIsLoading(true);
    
    // Simulate scanning delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock verification result
    const mockResult = {
      credential_type: "citizenship",
      issuer_name: "Government of Demo Nation",
      verification_result: "verified",
      verification_method: "qr_scan",
      is_offline: false,
      verifier_name: "IDenTrust Scanner",
      location: "Current Device"
    };

    try {
      await Verification.create({
        credential_id: "demo-credential-123",
        verifier_name: mockResult.verifier_name,
        verification_type: "age_verification",
        verification_result: mockResult.verification_result,
        verification_method: mockResult.verification_method,
        location: mockResult.location,
        is_offline: mockResult.is_offline
      });

      setVerificationResult(mockResult);
      loadRecentVerifications();
    } catch (error) {
      console.error("Error saving verification:", error);
    }

    setIsScanning(false);
    setIsLoading(false);
  };

  const verifyManualHash = async () => {
    if (!manualHash.trim()) return;

    setIsLoading(true);
    
    // Simulate hash verification
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockResult = {
      credential_type: "education",
      issuer_name: "Demo University",
      verification_result: "verified",
      verification_method: "manual_review",
      is_offline: true,
      verifier_name: "Manual Verification",
      location: "Hash Input"
    };

    try {
      await Verification.create({
        credential_id: manualHash,
        verifier_name: mockResult.verifier_name,
        verification_type: "qualification_check",
        verification_result: mockResult.verification_result,
        verification_method: mockResult.verification_method,
        location: mockResult.location,
        is_offline: mockResult.is_offline
      });

      setVerificationResult(mockResult);
      setManualHash("");
      loadRecentVerifications();
    } catch (error) {
      console.error("Error saving verification:", error);
    }

    setIsLoading(false);
  };

  const loadRecentVerifications = async () => {
    try {
      const verifications = await Verification.list('-created_date', 5);
      setRecentVerifications(verifications);
    } catch (error) {
      console.error("Error loading verifications:", error);
    }
  };

  React.useEffect(() => {
    loadRecentVerifications();
  }, []);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Simulate QR code from image processing
      simulateQRScan();
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <QrCode className="w-8 h-8 text-blue-600" />
            Verify Identity
          </h1>
          <p className="text-slate-600 mt-1">
            Scan QR codes or verify credentials manually
          </p>
        </div>
        <Badge className="bg-green-100 text-green-800 border-green-200">
          <Shield className="w-3 h-3 mr-1" />
          Zero-Knowledge Verification Active
        </Badge>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Verification Methods */}
        <div className="lg:col-span-2 space-y-6">
          {/* QR Code Scanner */}
          <Card className="border-2 border-dashed border-blue-300 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <Scan className="w-5 h-5" />
                QR Code Scanner
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="w-32 h-32 mx-auto bg-white rounded-xl border-2 border-blue-200 flex items-center justify-center">
                {isScanning ? (
                  <div className="animate-spin">
                    <Camera className="w-12 h-12 text-blue-600" />
                  </div>
                ) : (
                  <QrCode className="w-12 h-12 text-blue-600" />
                )}
              </div>
              <div>
                <p className="text-slate-700 mb-4">
                  {isScanning ? "Scanning QR code..." : "Ready to scan credentials"}
                </p>
                <div className="flex gap-3 justify-center">
                  <Button
                    onClick={simulateQRScan}
                    disabled={isScanning || isLoading}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    {isScanning ? "Scanning..." : "Start Camera"}
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Image
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Manual Verification */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Manual Verification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Credential Hash
                </label>
                <Input
                  value={manualHash}
                  onChange={(e) => setManualHash(e.target.value)}
                  placeholder="Enter verification hash..."
                  className="font-mono text-sm"
                />
              </div>
              <Button
                onClick={verifyManualHash}
                disabled={!manualHash.trim() || isLoading}
                className="w-full"
                variant="outline"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                {isLoading ? "Verifying..." : "Verify Hash"}
              </Button>
            </CardContent>
          </Card>

          {/* Verification Result */}
          {verificationResult && (
            <Card className={`border-2 ${
              verificationResult.verification_result === 'verified' 
                ? 'border-green-300 bg-green-50' 
                : 'border-red-300 bg-red-50'
            }`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {verificationResult.verification_result === 'verified' ? (
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-600" />
                  )}
                  Verification {verificationResult.verification_result === 'verified' ? 'Successful' : 'Failed'}
                </CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-600">Credential Type</p>
                  <p className="font-semibold capitalize">
                    {verificationResult.credential_type?.replace(/_/g, ' ')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Issuer</p>
                  <p className="font-semibold">{verificationResult.issuer_name}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Method</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {verificationResult.verification_method?.replace(/_/g, ' ')}
                    </Badge>
                    {verificationResult.is_offline && (
                      <Badge className="bg-orange-100 text-orange-800">
                        <Smartphone className="w-3 h-3 mr-1" />
                        Offline
                      </Badge>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Verified At</p>
                  <p className="font-semibold">{format(new Date(), "MMM dd, yyyy HH:mm")}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Recent Verifications */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Recent Verifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentVerifications.length > 0 ? (
                <div className="space-y-3">
                  {recentVerifications.map((verification) => (
                    <div
                      key={verification.id}
                      className="p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Badge 
                          className={
                            verification.verification_result === 'verified'
                              ? 'bg-green-100 text-green-800'
                              : verification.verification_result === 'failed'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }
                        >
                          {verification.verification_result === 'verified' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                          {verification.verification_result === 'failed' && <XCircle className="w-3 h-3 mr-1" />}
                          {verification.verification_result === 'pending' && <AlertTriangle className="w-3 h-3 mr-1" />}
                          {verification.verification_result}
                        </Badge>
                        {verification.is_offline && (
                          <Badge variant="outline" className="text-xs">
                            Offline
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm font-medium text-slate-900 capitalize">
                        {verification.verification_type?.replace(/_/g, ' ')}
                      </p>
                      <p className="text-xs text-slate-600 mt-1">
                        {verification.verifier_name} • {format(new Date(verification.created_date), "MMM dd, HH:mm")}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-slate-600">No verifications yet</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Start by scanning a QR code
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Verification Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Privacy Protection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-slate-900">Zero-Knowledge Proofs</p>
                  <p className="text-xs text-slate-600">Only required information is shared</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-slate-900">Blockchain Verified</p>
                  <p className="text-xs text-slate-600">Tamper-proof verification</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Smartphone className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-slate-900">Offline Capable</p>
                  <p className="text-xs text-slate-600">Works without internet</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}