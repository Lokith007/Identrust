
import { useState, useEffect } from "react";
import React from "react";
import { Identity } from "../entities/Identies";
import { Credential } from "../entities/Credentials";
import {  Verification } from "../entities/Verification";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { 
  Shield, 
  Wallet, 
  CheckCircle2, 
  AlertTriangle,
  Eye,
  Lock,
  Globe,
  Zap,
  Plus,
  TrendingUp,
  Users,
  Activity,
  Sparkles
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function Dashboard() {
  const [identity, setIdentity] = useState(null);
  const [credentials, setCredentials] = useState([]);
  const [verifications, setVerifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const identityData = await Identity.list();
      const credentialsData = await Credential.list('-created_date');
      const verificationsData = await Verification.list('-created_date', 10);
      
      setIdentity(identityData[0] || null);
      setCredentials(credentialsData);
      setVerifications(verificationsData);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
    setIsLoading(false);
  };

  const getVerificationLevel = () => {
    if (!identity) return { level: "Unverified", color: "bg-red-100 text-red-800 border-red-200", icon: AlertTriangle };
    
    switch (identity.verification_level) {
      case "premium":
        return { level: "Premium Verified", color: "bg-emerald-100 text-emerald-800 border-emerald-200", icon: CheckCircle2 };
      case "enhanced":
        return { level: "Enhanced", color: "bg-teal-100 text-teal-800 border-teal-200", icon: Shield };
      case "basic":
        return { level: "Basic Verified", color: "bg-amber-100 text-amber-800 border-amber-200", icon: CheckCircle2 };
      default:
        return { level: "Unverified", color: "bg-slate-100 text-slate-800 border-slate-200", icon: AlertTriangle };
    }
  };

  const verificationStatus = getVerificationLevel();

  const statsCards = [
    {
      title: "Digital Identity",
      value: identity ? "Active" : "Setup Required",
      icon: Shield,
      gradient: "from-teal-500 to-emerald-500",
      description: identity ? `Verified: ${verificationStatus.level}` : "Create your identity",
      glow: "glow-teal"
    },
    {
      title: "Credentials",
      value: credentials.length,
      icon: Wallet,
      gradient: "from-blue-500 to-cyan-500",
      description: `${credentials.filter(c => c.status === 'active').length} active`,
      glow: "glow-blue"
    },
    {
      title: "Verifications",
      value: verifications.length,
      icon: CheckCircle2,
      gradient: "from-violet-500 to-purple-500",
      description: "Total checks performed",
      glow: "glow-violet"
    },
    {
      title: "Trust Score",
      value: identity ? "94%" : "0%",
      icon: TrendingUp,
      gradient: "from-emerald-500 to-green-500",
      description: "Network confidence level",
      glow: "glow-emerald"
    }
  ];

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      <style jsx>{`
        .glassmorphism {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
        }
        
        .hover-lift {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .hover-lift:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px 0 rgba(31, 38, 135, 0.5);
        }
        
        .glow-teal { box-shadow: 0 0 30px rgba(20, 184, 166, 0.4); }
        .glow-blue { box-shadow: 0 0 30px rgba(59, 130, 246, 0.4); }
        .glow-violet { box-shadow: 0 0 30px rgba(139, 92, 246, 0.4); }
        .glow-emerald { box-shadow: 0 0 30px rgba(16, 185, 129, 0.4); }
      `}</style>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-8 h-8 text-teal-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Dashboard
            </h1>
          </div>
          <p className="text-slate-600 text-lg">
            Welcome to your decentralized identity platform
          </p>
        </div>
        <div className="flex gap-4">
          <Link to={createPageUrl("Wallet")}>
            <Button variant="outline" className="glassmorphism border-teal-200 hover:border-teal-300 text-teal-700 hover-lift rounded-2xl px-6 py-3">
              <Wallet className="w-5 h-5 mr-2" />
              View Wallet
            </Button>
          </Link>
          <Link to={createPageUrl("Issue")}>
            <Button className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white shadow-lg hover-lift glow-teal rounded-2xl px-6 py-3">
              <Plus className="w-5 h-5 mr-2" />
              New Credential
            </Button>
          </Link>
        </div>
      </div>

      {/* Identity Status Banner */}
      {identity && (
        <Card className="glassmorphism rounded-3xl border-2 border-teal-200 hover-lift glow-teal">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-3xl flex items-center justify-center shadow-xl">
                    <Shield className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full flex items-center justify-center shadow-lg">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">
                    {identity.full_name}
                  </h3>
                  <div className="flex items-center gap-3">
                    <Badge className={`${verificationStatus.color} border-2 px-4 py-2 rounded-xl font-semibold`}>
                      <verificationStatus.icon className="w-4 h-4 mr-2" />
                      {verificationStatus.level}
                    </Badge>
                    <span className="text-slate-600 font-medium">
                      • {identity.nationality}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-600 font-semibold mb-2">Blockchain Address</p>
                <p className="font-mono text-sm text-slate-800 glassmorphism px-4 py-2 rounded-xl">
                  {identity.wallet_address?.slice(0, 20)}...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <Card key={index} className="glassmorphism rounded-3xl hover-lift group relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-r ${stat.gradient} opacity-10 rounded-full transform translate-x-16 -translate-y-16`} />
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className={`p-4 bg-gradient-to-r ${stat.gradient} rounded-2xl shadow-lg ${stat.glow}`}>
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <Activity className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">{stat.title}</p>
              <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-sm text-slate-500">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Credentials */}
        <Card className="lg:col-span-2 glassmorphism rounded-3xl hover-lift">
          <CardHeader className="pb-6">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-3 text-xl font-bold">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
                Recent Credentials
              </CardTitle>
              <Link to={createPageUrl("Wallet")}>
                <Button variant="ghost" className="text-teal-600 hover:text-teal-700 hover:bg-teal-50 rounded-xl px-4 py-2">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {credentials.length > 0 ? (
              <div className="space-y-4">
                {credentials.slice(0, 5).map((credential) => (
                  <div
                    key={credential.id}
                    className="flex items-center justify-between p-5 glassmorphism rounded-2xl hover-lift group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-teal-100 to-blue-100 rounded-2xl flex items-center justify-center">
                        <Shield className="w-6 h-6 text-teal-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 capitalize">
                          {credential.credential_type.replace(/_/g, ' ')}
                        </p>
                        <p className="text-sm text-slate-600">
                          Issued by {credential.issuer_name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge 
                        className={
                          credential.status === 'active' 
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-200 px-3 py-1 rounded-xl'
                            : 'bg-slate-100 text-slate-800 border-slate-200 px-3 py-1 rounded-xl'
                        }
                      >
                        {credential.status}
                      </Badge>
                      <Eye className="w-5 h-5 text-slate-400 group-hover:text-teal-600 transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center mx-auto mb-4">
                  <Wallet className="w-10 h-10 text-slate-400" />
                </div>
                <p className="text-slate-600 text-lg font-semibold">No credentials yet</p>
                <p className="text-slate-500 mt-2">
                  Start by adding your first credential
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* System Status & Quick Actions */}
        <div className="space-y-8">
          <Card className="glassmorphism rounded-3xl hover-lift">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-xl font-bold">
                <div className="p-2 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                Network Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center justify-between glassmorphism rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-md"></div>
                  <span className="text-sm font-medium text-slate-700">Base44 Blockchain</span>
                </div>
                <Badge className="bg-green-100 text-green-800 border-green-200 px-3 py-1 rounded-xl">Online</Badge>
              </div>
              <div className="flex items-center justify-between glassmorphism rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <Lock className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium text-slate-700">Zero-Knowledge Proofs</span>
                </div>
                <Badge className="bg-blue-100 text-blue-800 border-blue-200 px-3 py-1 rounded-xl">Active</Badge>
              </div>
              <div className="flex items-center justify-between glassmorphism rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span className="text-sm font-medium text-slate-700">Offline Mode</span>
                </div>
                <Badge className="bg-amber-100 text-amber-800 border-amber-200 px-3 py-1 rounded-xl">Ready</Badge>
              </div>
              <div className="flex items-center justify-between glassmorphism rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 text-violet-500" />
                  <span className="text-sm font-medium text-slate-700">Network Nodes</span>
                </div>
                <Badge className="bg-violet-100 text-violet-800 border-violet-200 px-3 py-1 rounded-xl">5 Active</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="glassmorphism rounded-3xl hover-lift">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link to={createPageUrl("Verify")} className="block">
                <Button variant="outline" className="w-full justify-start glassmorphism hover-lift border-teal-200 hover:border-teal-300 text-teal-700 rounded-2xl py-3">
                  <CheckCircle2 className="w-5 h-5 mr-3" />
                  Verify Identity
                </Button>
              </Link>
              <Link to={createPageUrl("Demos")} className="block">
                <Button variant="outline" className="w-full justify-start glassmorphism hover-lift border-violet-200 hover:border-violet-300 text-violet-700 rounded-2xl py-3">
                  <Eye className="w-5 h-5 mr-3" />
                  View Demos
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}