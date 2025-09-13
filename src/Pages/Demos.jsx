import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { 
  PlayCircle,
  Building2,
  GraduationCap,
  Heart,
  Vote,
  CheckCircle2,
  Shield,
  Lock,
  Zap,
  QrCode,
  Users,
  Globe
} from "lucide-react";

export default function Demos() {
  const [activeDemo, setActiveDemo] = useState(null);
  const [demoStep, setDemoStep] = useState(0);

  const demoScenarios = [
    {
      id: "banking",
      title: "Banking KYC Verification",
      description: "User proves citizenship and age without revealing personal data",
      icon: Building2,
      color: "bg-blue-600",
      steps: [
        "User approaches bank for account opening",
        "Bank requests age and citizenship verification",
        "User generates Zero-Knowledge proof showing 18+ and citizenship",
        "Bank verifies proof without accessing personal data",
        "Account approved while maintaining user privacy"
      ],
      zkProof: "Prove: Age ≥ 18 AND Citizenship = Valid",
      dataShared: "Zero personal data revealed",
      outcome: "Account opened with full privacy protection"
    },
    {
      id: "education",
      title: "Exam Hall Entry",
      description: "Offline QR verification for exam eligibility",
      icon: GraduationCap,
      color: "bg-green-600",
      steps: [
        "Student arrives at exam hall with smartphone offline",
        "QR code generated from stored credential",
        "Exam proctor scans QR code with offline device",
        "Cryptographic verification confirms student eligibility",
        "Entry granted without internet connectivity"
      ],
      zkProof: "Prove: Student_ID = Valid AND Course_Enrolled = TRUE",
      dataShared: "Only exam eligibility status",
      outcome: "Secure offline verification completed"
    },
    {
      id: "healthcare",
      title: "Medical Record Access",
      description: "Patient shares vaccination proof without full medical history",
      icon: Heart,
      color: "bg-red-600",
      steps: [
        "Patient visits new healthcare provider",
        "Provider requests vaccination status",
        "Patient selects specific vaccine credentials to share",
        "ZK proof confirms vaccination without revealing other medical data",
        "Treatment proceeds with verified immunity status"
      ],
      zkProof: "Prove: COVID_Vaccine = Completed AND Date > Required",
      dataShared: "Only vaccination status and date",
      outcome: "Healthcare access with medical privacy intact"
    },
    {
      id: "voting",
      title: "Digital Voting Pilot",
      description: "Citizens prove eligibility privately for secure voting",
      icon: Vote,
      color: "bg-purple-600",
      steps: [
        "Citizen accesses digital voting platform",
        "System requests eligibility verification",
        "Citizen proves age, citizenship, and registration status",
        "Voting booth opens without revealing voter identity",
        "Vote cast with full anonymity and verifiable eligibility"
      ],
      zkProof: "Prove: Age ≥ 18 AND Citizenship = Valid AND Registration = Active",
      dataShared: "No personal identifiers shared",
      outcome: "Anonymous vote with verified eligibility"
    }
  ];

  const startDemo = (demoId) => {
    setActiveDemo(demoId);
    setDemoStep(0);
  };

  const nextStep = () => {
    const demo = demoScenarios.find(d => d.id === activeDemo);
    if (demoStep < demo.steps.length - 1) {
      setDemoStep(demoStep + 1);
    }
  };

  const resetDemo = () => {
    setActiveDemo(null);
    setDemoStep(0);
  };

  const currentDemo = demoScenarios.find(d => d.id === activeDemo);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <PlayCircle className="w-8 h-8 text-blue-600" />
            Demo Scenarios
          </h1>
          <p className="text-slate-600 mt-1">
            Experience real-world applications of decentralized identity
          </p>
        </div>
        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
          <Shield className="w-3 h-3 mr-1" />
          Interactive Demonstrations
        </Badge>
      </div>

      {!activeDemo ? (
        /* Scenario Selection */
        <div className="grid md:grid-cols-2 gap-6">
          {demoScenarios.map((scenario) => (
            <Card key={scenario.id} className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 ${scenario.color} rounded-xl flex items-center justify-center`}>
                      <scenario.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{scenario.title}</CardTitle>
                      <p className="text-sm text-slate-600 mt-1">
                        {scenario.description}
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-xs">
                    <Lock className="w-3 h-3 mr-1" />
                    Zero-Knowledge
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    <Shield className="w-3 h-3 mr-1" />
                    Privacy-First
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    <Zap className="w-3 h-3 mr-1" />
                    Offline Ready
                  </Badge>
                </div>
                
                <Button
                  onClick={() => startDemo(scenario.id)}
                  className="w-full group-hover:bg-slate-900 transition-colors"
                >
                  <PlayCircle className="w-4 h-4 mr-2" />
                  Start Demo
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* Active Demo */
        <div className="space-y-6">
          <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 ${currentDemo.color} rounded-xl flex items-center justify-center`}>
                    <currentDemo.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{currentDemo.title}</CardTitle>
                    <p className="text-slate-600">{currentDemo.description}</p>
                  </div>
                </div>
                <Button variant="outline" onClick={resetDemo}>
                  Back to Demos
                </Button>
              </div>
            </CardHeader>
          </Card>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Demo Steps */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Step {demoStep + 1} of {currentDemo.steps.length}</span>
                    <Badge className="bg-blue-100 text-blue-800">
                      In Progress
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${currentDemo.color} transition-all duration-500`}
                      style={{ width: `${((demoStep + 1) / currentDemo.steps.length) * 100}%` }}
                    />
                  </div>

                  {/* Current Step */}
                  <div className="p-6 border-2 border-dashed border-blue-300 bg-blue-50 rounded-lg">
                    <div className="flex items-start gap-4">
                      <div className={`w-8 h-8 ${currentDemo.color} rounded-full flex items-center justify-center text-white font-semibold`}>
                        {demoStep + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-slate-900 font-medium text-lg">
                          {currentDemo.steps[demoStep]}
                        </p>
                        
                        {demoStep === currentDemo.steps.length - 1 && (
                          <div className="mt-4 p-4 bg-green-100 border border-green-300 rounded-lg">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="w-5 h-5 text-green-600" />
                              <span className="font-semibold text-green-800">Demo Complete!</span>
                            </div>
                            <p className="text-green-700 text-sm mt-1">
                              {currentDemo.outcome}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Navigation */}
                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => setDemoStep(Math.max(0, demoStep - 1))}
                      disabled={demoStep === 0}
                    >
                      Previous Step
                    </Button>
                    <Button
                      onClick={demoStep === currentDemo.steps.length - 1 ? resetDemo : nextStep}
                      className={demoStep === currentDemo.steps.length - 1 ? "bg-green-600 hover:bg-green-700" : ""}
                    >
                      {demoStep === currentDemo.steps.length - 1 ? "Try Another Demo" : "Next Step"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Demo Info */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    Zero-Knowledge Proof
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-slate-50 p-4 rounded-lg font-mono text-sm">
                    {currentDemo.zkProof}
                  </div>
                  <p className="text-xs text-slate-600 mt-2">
                    Mathematical proof generated without revealing underlying data
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Privacy Protection
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-slate-900">Data Shared:</p>
                    <p className="text-sm text-slate-600">{currentDemo.dataShared}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-green-700">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Personal data remains private</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-green-700">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Cryptographically secure</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-green-700">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Tamper-proof verification</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Network Benefits
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <QrCode className="w-4 h-4 text-blue-500" />
                    <span>Works offline</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-purple-500" />
                    <span>Distributed trust</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Zap className="w-4 h-4 text-orange-500" />
                    <span>Instant verification</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span>No central authority</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* Key Features Footer */}
      {!activeDemo && (
        <Card className="bg-gradient-to-r from-slate-900 to-blue-900 text-white">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2">Why IDenTrust Matters</h3>
              <p className="text-slate-300">
                Building a resilient future with self-sovereign digital identity
              </p>
            </div>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6" />
                </div>
                <h4 className="font-semibold mb-1">No Single Point of Failure</h4>
                <p className="text-xs text-slate-300">Distributed across multiple nodes</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Lock className="w-6 h-6" />
                </div>
                <h4 className="font-semibold mb-1">Privacy-First Design</h4>
                <p className="text-xs text-slate-300">Zero-knowledge proofs protect data</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-6 h-6" />
                </div>
                <h4 className="font-semibold mb-1">Offline Capable</h4>
                <p className="text-xs text-slate-300">Works without internet connection</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Globe className="w-6 h-6" />
                </div>
                <h4 className="font-semibold mb-1">Globally Inclusive</h4>
                <p className="text-xs text-slate-300">Serves underconnected communities</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}