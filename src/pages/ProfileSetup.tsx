import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useAuth, useNotification } from '@/hooks';
import { Button, Card, Input, Select } from '@/components/ui';
import { profileSetupSchema, ProfileSetupFormData } from '@/lib/validations';
import { BUSINESS_TYPES, ROUTES } from '@/lib/constants';
import { createUserProfile } from '@/api/user.service';

export function ProfileSetup() {
  const navigate = useNavigate();
  const { firebaseUser, refreshUser } = useAuth();
  const { showSuccess, showError } = useNotification();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileSetupFormData>({
    resolver: zodResolver(profileSetupSchema),
  });

  const onSubmit = async (data: ProfileSetupFormData) => {
    if (!firebaseUser) {
      showError('Not authenticated');
      return;
    }

    try {
      await createUserProfile(firebaseUser.uid, firebaseUser.email!, data);
      await refreshUser();
      showSuccess('Profile created successfully!');
      navigate(ROUTES.PENDING_APPROVAL);
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Failed to create profile');
    }
  };

  return (
    <div className="min-h-screen bg-marble flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full" padding="lg">
        <div className="text-center mb-8">
          <h1 className="serif text-3xl font-bold text-charcoal mb-2">Complete Your Profile</h1>
          <p className="text-slate">Set up your account to access the platform</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              {...register('firstName')}
              error={errors.firstName?.message}
              required
            />
            <Input
              label="Last Name"
              {...register('lastName')}
              error={errors.lastName?.message}
              required
            />
          </div>

          <Input
            label="License Number"
            {...register('licenseNumber')}
            error={errors.licenseNumber?.message}
            placeholder="OCM-001"
            helperText="Your NY OCM license number"
            required
          />

          <Input
            label="Company Name"
            {...register('companyName')}
            error={errors.companyName?.message}
            required
          />

          <Select
            label="Business Type"
            {...register('businessType')}
            error={errors.businessType?.message}
            options={[
              { value: '', label: 'Select business type' },
              ...BUSINESS_TYPES.map((type) => ({ value: type, label: type })),
            ]}
            required
          />

          <Input
            label="Phone Number (Optional)"
            {...register('phone')}
            error={errors.phone?.message}
            type="tel"
            placeholder="+1234567890"
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            isLoading={isSubmitting}
          >
            Create Profile
          </Button>
        </form>
      </Card>
    </div>
  );
}
