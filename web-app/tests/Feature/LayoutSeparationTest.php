<?php

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\File;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class LayoutSeparationTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = User::factory()->create([
            'role' => UserRole::ADMIN,
            'is_active' => true,
        ]);
    }

    public function test_public_root_uses_public_home_page_without_admin_sidebar(): void
    {
        $response = $this->get('/');
        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('public/home')
        );
    }

    public function test_logged_in_admin_visiting_root_still_gets_public_landing_page(): void
    {
        $response = $this->actingAs($this->admin)->get('/');
        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('public/home')
        );
    }

    public function test_public_communication_modes_do_not_use_admin_layouts(): void
    {
        $this->get('/bantuan-darurat')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('public/assistance/index'));

        $this->get('/tidak-dapat-berbicara')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('public/nonverbal/index'));

        $this->get('/tidak-dapat-mendengar')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('public/deaf/index'));
    }

    public function test_auth_login_route_uses_auth_layout_and_not_admin_layout(): void
    {
        $this->get('/login')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('auth/login'));
    }

    public function test_admin_dashboard_access_control_and_component_mapping(): void
    {
        // Guest directed to login
        $this->get('/admin/dashboard')->assertRedirect('/login');

        // Admin can open dashboard
        $this->actingAs($this->admin)->get('/admin/dashboard')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('admin/dashboard/index'));
    }

    public function test_frontend_layout_separation_and_no_nested_sidebars(): void
    {
        $appTsx = File::get(base_path('resources/js/app.tsx'));
        
        // Ensure app.tsx does not default to AppLayout for generic pages
        $this->assertStringContainsString("case name.startsWith('public/'):", $appTsx);
        $this->assertStringContainsString("case name.startsWith('admin/'):", $appTsx);
        $this->assertStringNotContainsString("default:\n                return AppLayout;", $appTsx);

        $adminLayoutTsx = File::get(base_path('resources/js/layouts/AdminLayout.tsx'));
        // Ensure AdminLayout directly renders AppShell/AppSidebar without wrapping in AppLayout
        $this->assertStringContainsString('<AppShell variant="sidebar">', $adminLayoutTsx);
        $this->assertStringContainsString('<AppSidebar />', $adminLayoutTsx);
        $this->assertStringNotContainsString('<AppLayout', $adminLayoutTsx);

        $publicLayoutTsx = File::get(base_path('resources/js/layouts/PublicLayout.tsx'));
        // Ensure PublicLayout never imports admin sidebars or admin shells
        $this->assertStringNotContainsString('AppSidebar', $publicLayoutTsx);
        $this->assertStringNotContainsString('AdminSidebar', $publicLayoutTsx);
        $this->assertStringNotContainsString('SidebarProvider', $publicLayoutTsx);

        $appLogoTsx = File::get(base_path('resources/js/components/app-logo.tsx'));
        // Ensure branding displays ResponSetara and not Laravel cube icon
        $this->assertStringContainsString('Respon', $appLogoTsx);
        $this->assertStringContainsString('Setara', $appLogoTsx);
        $this->assertStringNotContainsString('AppLogoIcon', $appLogoTsx);
    }

    public function test_all_cms_routes_remain_fully_accessible(): void
    {
        $this->actingAs($this->admin);

        $this->get('/admin/categories')->assertOk()->assertInertia(fn (Assert $page) => $page->component('admin/categories/index'));
        $this->get('/admin/conditions')->assertOk()->assertInertia(fn (Assert $page) => $page->component('admin/conditions/index'));
        $this->get('/admin/assistance-types')->assertOk()->assertInertia(fn (Assert $page) => $page->component('admin/assistance-types/index'));
        $this->get('/admin/quick-phrases')->assertOk()->assertInertia(fn (Assert $page) => $page->component('admin/quick-phrases/index'));
        $this->get('/admin/helper-guides')->assertOk()->assertInertia(fn (Assert $page) => $page->component('admin/helper-guides/index'));
        $this->get('/admin/emergency-contacts')->assertOk()->assertInertia(fn (Assert $page) => $page->component('admin/emergency-contacts/index'));
        $this->get('/admin/site-contents')->assertOk()->assertInertia(fn (Assert $page) => $page->component('admin/site-contents/index'));
        $this->get('/admin/ai-prompts')->assertOk()->assertInertia(fn (Assert $page) => $page->component('admin/ai-prompts/index'));
        $this->get('/admin/statistics')->assertOk()->assertInertia(fn (Assert $page) => $page->component('admin/statistics/index'));
        $this->get('/admin/activity-logs')->assertOk()->assertInertia(fn (Assert $page) => $page->component('admin/activity-logs/index'));
    }
}
