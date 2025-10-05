# Dashboard Setup Guide

## ✅ What Was Created

A complete user management dashboard with full CRUD functionality integrated with your backend API and shared Zod schemas.

### Frontend Components Created:

```
galipette-portal/
├─ src/
│  ├─ common/
│  │  └─ services/
│  │     ├─ api-client.ts (NEW) ✨         - Axios instance with interceptors
│  │     ├─ users.service.ts (NEW) ✨      - Users API service with Zod validation
│  │     └─ index.ts (NEW) ✨              - Service exports
│  └─ app/
│     └─ routes/
│        └─ screens/
│           ├─ DashboardPage.tsx (UPDATED) - Main dashboard with user management
│           └─ components/
│              ├─ UserTable.tsx (NEW) ✨   - User list table component
│              └─ CreateUserForm.tsx (NEW) ✨ - User creation form with validation
└─ package.json (UPDATED)                  - Added @galipette/shared + zod
```

## 🚀 Setup Instructions

### 1. Install Dependencies

```bash
cd galipette-portal
npm install
```

This will install:

- `@galipette/shared` (local package with Zod schemas)
- `zod` (validation library)

### 2. Configure Environment

Create a `.env` file in the `galipette-portal` directory:

```bash
# .env
VITE_API_URL=http://localhost:3000/api
```

Or use `.env.local` for local development:

```bash
# .env.local
VITE_API_URL=http://localhost:3000/api
```

### 3. Start Backend

Make sure your backend is running:

```bash
cd ../galipette-backend
npm run dev
```

The backend should be running on `http://localhost:3000`

### 4. Start Frontend

```bash
cd galipette-portal
npm run dev
```

The frontend should be running on `http://localhost:5173` (or similar)

### 5. Navigate to Dashboard

Open your browser and go to:

```
http://localhost:5173/dashboard
```

## 🎯 Features

### ✨ User Management Dashboard

1. **View Users**
   - Displays all users in a clean table
   - Shows: ID, Username, Email, Created Date
   - Loading states with spinner
   - Empty state message

2. **Create User**
   - Click "Create User" button
   - Modal form with validation
   - Real-time validation using Zod schemas
   - Clear error messages
   - Auto-refresh after creation

3. **Delete User**
   - Delete button (trash icon) for each user
   - Confirmation dialog
   - Auto-refresh after deletion

4. **Refresh List**
   - Manual refresh button with spinning icon
   - Auto-refresh after create/delete

5. **Statistics**
   - Total users count card

### 🔒 Validation Features

- **Client-side validation** using shared Zod schemas
- **Server-side validation** using same schemas
- **Type-safe** TypeScript throughout
- **Detailed error messages** for each field

Example validations:

- Email must be valid format
- Username: 3-50 characters, alphanumeric + `_` and `-` only

## 🏗️ Architecture

### Data Flow

```
┌──────────────┐
│ DashboardPage│
└──────┬───────┘
       │
       │ uses
       │
┌──────▼──────────┐
│ usersService    │ ← Validates with Zod before sending
└──────┬──────────┘
       │
       │ calls
       │
┌──────▼──────────┐
│ apiClient       │ ← Axios instance with interceptors
└──────┬──────────┘
       │
       │ HTTP
       │
┌──────▼──────────┐
│ Backend API     │ ← Also validates with same Zod schemas
└─────────────────┘
```

### Component Structure

```
DashboardPage
├─ UserTable (displays users)
└─ CreateUserForm (modal for creating users)
```

## 📝 Usage Examples

### Fetching Users

```typescript
// Automatically done in DashboardPage on mount
const { users } = await usersService.getAll();
```

### Creating a User

```typescript
// In CreateUserForm
const userData: CreateUserDto = {
  email: 'john@example.com',
  username: 'john_doe',
};

// Validates client-side with Zod
await usersService.create(userData);
```

### Deleting a User

```typescript
await usersService.delete(userId);
```

## 🎨 Customization

### Styling

The components use Tailwind CSS classes. You can customize:

- Colors: Change `blue-600`, `gray-100`, etc.
- Layout: Adjust spacing, padding
- Typography: Change font sizes, weights

### API Configuration

Update the API URL in your `.env`:

```bash
VITE_API_URL=https://your-production-api.com/api
```

### Adding More Fields

To add more user fields:

1. Update Prisma schema
2. Update Zod schemas in `galipette-shared-lib/types/users.schema.ts`
3. Update frontend components to display/input new fields
4. Types will automatically propagate!

## 🧪 Testing the Dashboard

### Test Scenario 1: Create User

1. Click "Create User" button
2. Try submitting empty form → See validation errors
3. Enter invalid email → See email format error
4. Enter username "ab" → See minimum length error
5. Enter valid data:
   - Email: `test@example.com`
   - Username: `test_user`
6. Submit → User appears in table

### Test Scenario 2: Validation

Try these to see validation in action:

- Email: `invalid` → "Invalid email format"
- Username: `ab` → "Username must be at least 3 characters"
- Username: `ab` → "Username must be at least 3 characters"
- Username: `this-is-a-very-long-username-that-exceeds-fifty-chars` → "Username must not exceed 50 characters"
- Username: `user@123` → "Username can only contain letters, numbers, underscores, and hyphens"

### Test Scenario 3: Delete User

1. Click trash icon on any user
2. Confirm deletion
3. User disappears from table

### Test Scenario 4: Refresh

1. Click "Refresh" button
2. Watch spinner animation
3. List updates

## 🔍 Debugging

### Backend Not Running

If you see network errors:

```
Failed to load users. Please try again.
```

**Solution:** Make sure backend is running on `http://localhost:3000`

```bash
cd galipette-backend
npm run dev
```

### CORS Errors

If you see CORS errors in browser console:

**Solution:** Check backend CORS configuration in `galipette-backend/src/app.ts`

### Import Errors

If you see "Cannot find module '@galipette/shared'":

**Solution:** Run `npm install` in `galipette-portal`:

```bash
cd galipette-portal
npm install
```

## 🚀 Next Steps

### Extend the Dashboard

1. **Add Pagination**

   ```typescript
   const { users, meta } = await usersService.getAll({
     page: 1,
     limit: 10,
   });
   ```

2. **Add Search/Filter**
   - Add search input
   - Filter users by username or email

3. **Add Edit Functionality**
   - Create `EditUserForm` component
   - Use `updateUserSchema` for validation
   - Call `usersService.update()`

4. **Add More Modules**
   - Characters management
   - Campaigns management
   - Apply same pattern!

### Production Checklist

- [ ] Add authentication (JWT tokens)
- [ ] Add authorization (role checks)
- [ ] Add pagination for large datasets
- [ ] Add error boundary components
- [ ] Add loading skeletons
- [ ] Add toast notifications instead of alerts
- [ ] Add optimistic UI updates
- [ ] Add unit tests for components
- [ ] Add E2E tests

## 📚 Key Files Reference

| File                 | Purpose                                 |
| -------------------- | --------------------------------------- |
| `api-client.ts`      | Axios configuration with interceptors   |
| `users.service.ts`   | User API calls with Zod validation      |
| `DashboardPage.tsx`  | Main page with state management         |
| `UserTable.tsx`      | Displays users in table format          |
| `CreateUserForm.tsx` | Form with validation and error handling |

## ✨ Benefits of This Implementation

1. **Type Safety**: Shared types across frontend and backend
2. **Validation**: Client-side and server-side using same Zod schemas
3. **DRY**: No duplication of types or validation logic
4. **Maintainable**: Changes to schemas automatically propagate
5. **Developer Experience**: Clear error messages, autocomplete
6. **User Experience**: Immediate validation feedback

---

**Status:** ✅ **Ready to Use!**

Navigate to `/dashboard` and start managing users! 🎉
