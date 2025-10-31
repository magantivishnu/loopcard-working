// src/screens/SetupWizard.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface WizardData {
  // Step 1: Photo
  photoUri: string | null;
  
  // Step 2: Basic Info
  fullName: string;
  businessName: string;
  role: string;
  tagline: string;
  
  // Step 3: Contact & Links
  phone: string;
  whatsapp: string;
  email: string;
  website: string;
  linkedin: string;
  twitter: string;
  instagram: string;
  facebook: string;
}

const SetupWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [wizardData, setWizardData] = useState<WizardData>({
    photoUri: null,
    fullName: '',
    businessName: '',
    role: '',
    tagline: '',
    phone: '',
    whatsapp: '',
    email: '',
    website: '',
    linkedin: '',
    twitter: '',
    instagram: '',
    facebook: '',
  });

  const totalSteps = 4;

  const updateWizardData = (data: Partial<WizardData>) => {
    setWizardData(prev => ({ ...prev, ...data }));
  };

  const handleNext = () => {
    // Validation will be added per step
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canGoNext = () => {
    // Step-specific validation
    switch (currentStep) {
      case 1:
        return true; // Photo is optional
      case 2:
        return wizardData.fullName.trim().length > 0; // Name is required
      case 3:
        return true; // All contact fields are optional
      case 4:
        return true; // Preview step
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Upload Profile Photo</Text>
            <Text style={styles.stepSubtitle}>Add a professional photo for your card</Text>
            {/* Photo upload component will go here */}
            <View style={styles.placeholderBox}>
              <Ionicons name="camera" size={48} color="#ccc" />
              <Text style={styles.placeholderText}>Photo upload coming in Step 2</Text>
            </View>
          </View>
        );
      
      case 2:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Basic Information</Text>
            <Text style={styles.stepSubtitle}>Tell us about yourself</Text>
            {/* Form fields will go here */}
            <View style={styles.placeholderBox}>
              <Text style={styles.placeholderText}>Form fields coming in Step 3</Text>
            </View>
          </View>
        );
      
      case 3:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Contact & Links</Text>
            <Text style={styles.stepSubtitle}>Add your contact details and social links</Text>
            {/* Contact form will go here */}
            <View style={styles.placeholderBox}>
              <Text style={styles.placeholderText}>Contact form coming in Step 4</Text>
            </View>
          </View>
        );
      
      case 4:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Preview Your Card</Text>
            <Text style={styles.stepSubtitle}>Review and generate your digital card</Text>
            {/* Preview component will go here */}
            <View style={styles.placeholderBox}>
              <Text style={styles.placeholderText}>Card preview coming in Step 5</Text>
            </View>
          </View>
        );
      
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            {[1, 2, 3, 4].map((step) => (
              <View
                key={step}
                style={[
                  styles.progressDot,
                  step <= currentStep && styles.progressDotActive,
                ]}
              >
                <Text
                  style={[
                    styles.progressDotText,
                    step <= currentStep && styles.progressDotTextActive,
                  ]}
                >
                  {step}
                </Text>
              </View>
            ))}
            <View style={styles.progressLine} />
            <View
              style={[
                styles.progressLineFilled,
                { width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            Step {currentStep} of {totalSteps}
          </Text>
        </View>

        {/* Step Content */}
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {renderStepContent()}
        </ScrollView>

        {/* Navigation Buttons */}
        <View style={styles.navigationContainer}>
          <TouchableOpacity
            style={[styles.navButton, styles.backButton, currentStep === 1 && styles.navButtonDisabled]}
            onPress={handleBack}
            disabled={currentStep === 1}
          >
            <Ionicons name="arrow-back" size={20} color={currentStep === 1 ? '#ccc' : '#666'} />
            <Text style={[styles.navButtonText, currentStep === 1 && styles.navButtonTextDisabled]}>
              Back
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navButton, styles.nextButton, !canGoNext() && styles.navButtonDisabled]}
            onPress={handleNext}
            disabled={!canGoNext()}
          >
            <Text style={[styles.nextButtonText, !canGoNext() && styles.navButtonTextDisabled]}>
              {currentStep === totalSteps ? 'Generate Card' : 'Next'}
            </Text>
            <Ionicons
              name={currentStep === totalSteps ? 'checkmark' : 'arrow-forward'}
              size={20}
              color={!canGoNext() ? '#ccc' : '#fff'}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardView: {
    flex: 1,
  },
  progressContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  progressBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 12,
  },
  progressLine: {
    position: 'absolute',
    left: 20,
    right: 20,
    height: 2,
    backgroundColor: '#e0e0e0',
    top: '50%',
    marginTop: -1,
    zIndex: 0,
  },
  progressLineFilled: {
    position: 'absolute',
    left: 20,
    height: 2,
    backgroundColor: '#007AFF',
    top: '50%',
    marginTop: -1,
    zIndex: 1,
  },
  progressDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  progressDotActive: {
    backgroundColor: '#007AFF',
  },
  progressDotText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#999',
  },
  progressDotTextActive: {
    color: '#fff',
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
  },
  stepContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
  },
  placeholderBox: {
    padding: 48,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  placeholderText: {
    marginTop: 16,
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 32 : 24,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  backButton: {
    backgroundColor: '#f0f0f0',
  },
  nextButton: {
    backgroundColor: '#007AFF',
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  navButtonDisabled: {
    opacity: 0.4,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  navButtonTextDisabled: {
    color: '#ccc',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default SetupWizard;