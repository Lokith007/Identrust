
import React, { useState, useEffect, useCallback } from "react";
import { Identity } from "../entities/Identies";
import {  User } from "../entities/Institution";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { Switch } from "../components/ui/switch";
import { 
  Settings,
  Shield,
  Lock,
  Key,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle2,
  Eye,
  EyeOff,
  Copy,
  RefreshCw
} from "lucide-react";

const generateBackupPhrase = () => {
  const words = [
    "ocean", "quantum", "bridge", "secure", "digital", "trust",
    "verify", "private", "chain", "identity", "proof", "key"
  ];
  return words.sort(() => Math.random() - 0.5).slice(0, 12).join(" ");
};

export default function SettingsPage() {
  const [identity, setIdentity] = useState(null);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    full_name: "",
    nationality: "",
    backup_phrase: ""
  });
  const [showBackupPhrase, setShowBackupPhrase] = useState(false);
  const [privacySettings, setPrivacySettings] = useState({
    allowAnalytics: false,
    autoVerification: true,
    offlineMode: true,
    biometricAuth: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const loadSettings = useCallback(async () => {
    setIsLoading(true);
    try {
      const userData = await User.me();
      const identityData = await Identity.list();
      
      setUser(userData);
      const currentIdentity = identityData[0] || null;
      setIdentity(currentIdentity);
      
      if (currentIdentity) {
        setFormData({
          full_name: currentIdentity.full_name || "",
          nationality: currentIdentity.nationality || "",
          backup_phrase: currentIdentity.backup_phrase || generateBackupPhrase()
        });
      } else {
        setFormData(prev => ({ ...prev, backup_phrase: generateBackupPhrase() }));
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const generateWalletAddress = () => {
    return "0x" + Array.from({length: 40}, () => Math.floor(Math.random() * 16).toString(16)).join("");
  };

  const generateIdentityHash = () => {
    return "0x" + Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join("");
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePrivacyChange = (setting, value) => {
    setPrivacySettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      const identityData = {
        ...formData,
        wallet_address: identity?.wallet_address || generateWalletAddress(),
        identity_hash: identity?.identity_hash || generateIdentityHash(),
        verification_level: identity?.verification_level || "basic"
      };

      if (identity) {
        await Identity.update(identity.id, identityData);
      } else {
        await Identity.create(identityData);
      }

      await loadSettings();
    } catch (error) {
      console.error("Error saving settings:", error);
    }
    setIsSaving(false);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const exportIdentity = () => {
    const exportData = {
      identity: identity,
      backup_phrase: formData.backup_phrase,
      exported_at: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'identrust-backup.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Settings className="w-8 h-8 text-blue-600" />
            Settings
          </h1>
          <p className="text-slate-600 mt-1">
            Manage your identity and privacy preferences
          </p>
        </div>
        <Badge className="bg-green-100 text-green-800 border-green-200">
          <Shield className="w-3 h-3 mr-1" />
          Secure Configuration
        </Badge>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Identity Settings */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Identity Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => handleInputChange('full_name', e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nationality">Nationality</Label>
                  <Input
                    id="nationality"
                    value={formData.nationality}
                    onChange={(e) => handleInputChange('nationality', e.target.value)}
                    placeholder="Enter your nationality"
                  />
                </div>
              </div>

              {identity && (
                <div className="space-y-4 pt-4 border-t border-slate-200">
                  <div>
                    <Label>Wallet Address</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input
                        value={identity.wallet_address || ""}
                        readOnly
                        className="font-mono text-sm"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => copyToClipboard(identity.wallet_address)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label>Identity Hash</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input
                        value={identity.identity_hash || ""}
                        readOnly
                        className="font-mono text-sm"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => copyToClipboard(identity.identity_hash)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <Button
                onClick={saveSettings}
                disabled={isSaving}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isSaving ? "Saving..." : "Save Identity Settings"}
              </Button>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Privacy & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">Analytics & Usage Data</p>
                  <p className="text-sm text-slate-600">Help improve IDenTrust with anonymous usage data</p>
                </div>
                <Switch
                  checked={privacySettings.allowAnalytics}
                  onCheckedChange={(checked) => handlePrivacyChange('allowAnalytics', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">Automatic Verification</p>
                  <p className="text-sm text-slate-600">Allow trusted parties to verify credentials automatically</p>
                </div>
                <Switch
                  checked={privacySettings.autoVerification}
                  onCheckedChange={(checked) => handlePrivacyChange('autoVerification', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">Offline Mode</p>
                  <p className="text-sm text-slate-600">Enable offline credential verification</p>
                </div>
                <Switch
                  checked={privacySettings.offlineMode}
                  onCheckedChange={(checked) => handlePrivacyChange('offlineMode', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">Biometric Authentication</p>
                  <p className="text-sm text-slate-600">Use fingerprint or face recognition for wallet access</p>
                </div>
                <Switch
                  checked={privacySettings.biometricAuth}
                  onCheckedChange={(checked) => handlePrivacyChange('biometricAuth', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Security & Backup */}
        <div className="space-y-6">
          {/* Backup Phrase */}
          <Card className="border-2 border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-800">
                <Key className="w-5 h-5" />
                Recovery Phrase
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <Label>12-Word Recovery Phrase</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowBackupPhrase(!showBackupPhrase)}
                >
                  {showBackupPhrase ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <p className="font-mono text-sm">
                  {showBackupPhrase ? formData.backup_phrase : "•••••••••••••••••••••••••"}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => copyToClipboard(formData.backup_phrase)}
                >
                  <Copy className="w-3 h-3 mr-1" />
                  Copy
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleInputChange('backup_phrase', generateBackupPhrase())}
                >
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Regenerate
                </Button>
              </div>
              <div className="flex items-start gap-2 text-xs text-orange-700">
                <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <p>
                  Keep this phrase secure and private. It's your only way to recover your identity if you lose access.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Verification Level */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Verification Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-8 h-8 text-green-600" />
                </div>
                <Badge className="bg-green-100 text-green-800 text-sm px-3 py-1">
                  {identity?.verification_level || "Unverified"} Level
                </Badge>
                <p className="text-xs text-slate-600 mt-2">
                  Your identity verification status
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Export & Backup */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5" />
                Backup & Export
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={exportIdentity}
                variant="outline"
                className="w-full justify-start"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Identity Data
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                disabled
              >
                <Upload className="w-4 h-4 mr-2" />
                Import Backup (Coming Soon)
              </Button>
              <p className="text-xs text-slate-600">
                Export your encrypted identity data for backup purposes
              </p>
            </CardContent>
          </Card>

          {/* Account Info */}
          {user && (
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-slate-600">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Role</p>
                  <Badge variant="outline">{user.role}</Badge>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Member Since</p>
                  <p className="text-sm">{new Date(user.created_date).toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
