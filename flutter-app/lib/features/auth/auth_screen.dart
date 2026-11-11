import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../core/theme/app_colors.dart';
import '../../core/widgets/brand_logo.dart';
import '../../core/widgets/curved_header_clipper.dart';
import '../../core/widgets/social_icons.dart';
import '../main/main_layout.dart';

class AuthScreen extends StatefulWidget {
  final bool initialIsRegister;

  const AuthScreen({super.key, this.initialIsRegister = false});

  @override
  State<AuthScreen> createState() => _AuthScreenState();
}

class _AuthScreenState extends State<AuthScreen> {
  late bool _isRegister;

  // Login controllers
  final _loginEmailController = TextEditingController(text: 'satria@student.itb.ac.id');
  final _loginPasswordController = TextEditingController(text: 'password123');
  bool _obscureLoginPassword = true;

  // Register controllers
  final _regNameController = TextEditingController();
  final _regNimController = TextEditingController();
  final _regGithubController = TextEditingController();
  final _regEmailController = TextEditingController();
  final _regPasswordController = TextEditingController();
  final _regConfirmPasswordController = TextEditingController();
  bool _obscureRegPassword = true;
  bool _obscureRegConfirmPassword = true;

  // States for animations & validation
  bool _isMorphingLoading = false;
  bool _isExpandingHeader = false;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _isRegister = widget.initialIsRegister;
  }

  @override
  void dispose() {
    _loginEmailController.dispose();
    _loginPasswordController.dispose();
    _regNameController.dispose();
    _regNimController.dispose();
    _regGithubController.dispose();
    _regEmailController.dispose();
    _regPasswordController.dispose();
    _regConfirmPasswordController.dispose();
    super.dispose();
  }

  void _toggleAuthMode(bool toRegister) {
    if (_isMorphingLoading || _isExpandingHeader) return;
    setState(() {
      _isRegister = toRegister;
      _errorMessage = null;
    });
  }

  Future<void> _submitAuth({bool isSocial = false}) async {
    if (_isMorphingLoading || _isExpandingHeader) return;

    if (!isSocial) {
      if (_isRegister) {
        if (_regNameController.text.trim().isEmpty ||
            _regNimController.text.trim().isEmpty ||
            _regGithubController.text.trim().isEmpty ||
            _regEmailController.text.trim().isEmpty ||
            _regPasswordController.text.isEmpty) {
          setState(() => _errorMessage = 'Harap lengkapi seluruh kolom pendaftaran.');
          return;
        }
        if (_regPasswordController.text != _regConfirmPasswordController.text) {
          setState(() => _errorMessage = 'Password dan Konfirmasi Password tidak cocok.');
          return;
        }
      } else {
        if (_loginEmailController.text.trim().isEmpty ||
            _loginPasswordController.text.isEmpty) {
          setState(() => _errorMessage = 'Email dan kata sandi wajib diisi.');
          return;
        }
      }
    }

    // Step 1: Shape Morphing Button -> Circle Loading
    setState(() {
      _errorMessage = null;
      _isMorphingLoading = true;
    });

    await Future.delayed(const Duration(milliseconds: 850));
    if (!mounted) return;

    // Step 2: Expand Dark Purple Top Header & Slide Down White Form Area
    setState(() {
      _isExpandingHeader = true;
    });

    await Future.delayed(const Duration(milliseconds: 360));
    if (!mounted) return;

    final String userName = _isRegister && _regNameController.text.trim().isNotEmpty
        ? _regNameController.text.trim()
        : 'Raden Satria';
    final String userNim = _isRegister && _regNimController.text.trim().isNotEmpty
        ? _regNimController.text.trim().toUpperCase()
        : 'V3925028';

    // Step 3: Transition to Dashboard with Bottom-Up White Circular Reveal
    Navigator.of(context).pushReplacement(
      PageRouteBuilder(
        transitionDuration: const Duration(milliseconds: 850),
        pageBuilder: (context, animation, secondaryAnimation) => MainLayout(
          userName: userName,
          userNim: userNim,
        ),
        transitionsBuilder: (context, animation, secondaryAnimation, child) {
          final curved = CurvedAnimation(
            parent: animation,
            curve: Curves.easeInOutCubic,
          );

          return Stack(
            children: [
              // Dark purple background base matching the expanded auth header
              Container(
                decoration: const BoxDecoration(
                  gradient: AppColors.headerPurpleGradient,
                ),
              ),
              // White dashboard body expanding smoothly via circular reveal from bottom to top
              ClipPath(
                clipper: BottomCircularRevealClipper(progress: curved.value),
                child: child,
              ),
            ],
          );
        },
      ),
    );
  }

  void _showForgotPasswordSheet() {
    final resetEmailController = TextEditingController(
      text: _loginEmailController.text,
    );
    bool isSent = false;
    bool isSending = false;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      barrierColor: Colors.black.withValues(alpha: 0.55),
      builder: (sheetContext) {
        return StatefulBuilder(
          builder: (context, setSheetState) {
            final mediaQuery = MediaQuery.of(context);
            return Padding(
              padding: EdgeInsets.only(bottom: mediaQuery.viewInsets.bottom),
              child: Container(
                constraints: BoxConstraints(
                  maxHeight: mediaQuery.size.height * 0.72,
                ),
                width: double.infinity,
                decoration: const BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.vertical(top: Radius.circular(36)),
                  boxShadow: [
                    BoxShadow(
                      color: Color(0x26000000),
                      blurRadius: 30,
                      offset: Offset(0, -6),
                    ),
                  ],
                ),
                child: SingleChildScrollView(
                  padding: const EdgeInsets.fromLTRB(24, 14, 24, 24),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Top Drag Handle + Close (X) Button
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const SizedBox(width: 36),
                          Container(
                            width: 42,
                            height: 4,
                            decoration: BoxDecoration(
                              color: AppColors.borderLight,
                              borderRadius: BorderRadius.circular(999),
                            ),
                          ),
                          IconButton(
                            onPressed: () => Navigator.of(sheetContext).pop(),
                            icon: const Icon(
                              LucideIcons.x,
                              size: 20,
                              color: AppColors.textMuted,
                            ),
                            tooltip: 'Tutup',
                          ),
                        ],
                      ),

                      const SizedBox(height: 8),

                      // Header Panel: Reset Password
                      Text(
                        'Reset Password',
                        style: GoogleFonts.plusJakartaSans(
                          fontSize: 22,
                          fontWeight: FontWeight.w800,
                          letterSpacing: -0.4,
                          color: AppColors.primaryDark,
                        ),
                      ),
                      const SizedBox(height: 8),

                      // Description
                      Text(
                        'Masukkan alamat email Anda dan kami akan mengirimkan tautan untuk mengatur ulang kata sandi Anda.',
                        style: GoogleFonts.plusJakartaSans(
                          fontSize: 13,
                          color: AppColors.textMuted,
                          height: 1.5,
                        ),
                      ),

                      const SizedBox(height: 22),

                      if (isSent)
                        Container(
                          padding: const EdgeInsets.all(14),
                          decoration: BoxDecoration(
                            color: const Color(0xFFECFDF5),
                            borderRadius: BorderRadius.circular(18),
                            border: Border.all(
                              color: AppColors.success.withValues(alpha: 0.4),
                            ),
                          ),
                          child: Row(
                            children: [
                              const Icon(
                                LucideIcons.checkCircle2,
                                color: AppColors.success,
                                size: 20,
                              ),
                              const SizedBox(width: 10),
                              Expanded(
                                child: Text(
                                  'Tautan pemulihan kata sandi telah dikirim ke ${resetEmailController.text.trim()}.',
                                  style: GoogleFonts.plusJakartaSans(
                                    fontSize: 12.5,
                                    fontWeight: FontWeight.w600,
                                    color: const Color(0xFF065F46),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        )
                      else ...[
                        // Rounded Input Field: Email
                        Text(
                          'Email',
                          style: GoogleFonts.plusJakartaSans(
                            fontSize: 12.5,
                            fontWeight: FontWeight.w700,
                            color: AppColors.textHeadingLight,
                          ),
                        ),
                        const SizedBox(height: 8),
                        TextField(
                          controller: resetEmailController,
                          keyboardType: TextInputType.emailAddress,
                          style: GoogleFonts.plusJakartaSans(
                            fontSize: 13.5,
                            color: AppColors.textHeadingLight,
                          ),
                          decoration: const InputDecoration(
                            prefixIcon: Icon(
                              LucideIcons.mail,
                              size: 17,
                              color: AppColors.textMuted,
                            ),
                            hintText: 'Masukkan alamat email terdaftar',
                          ),
                        ),
                      ],

                      const SizedBox(height: 24),

                      // Solid Dark Purple Button: Kirim Tautan
                      SizedBox(
                        width: double.infinity,
                        height: 52,
                        child: ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppColors.primarySolid,
                            foregroundColor: Colors.white,
                            elevation: 2,
                            shadowColor: AppColors.primaryDark.withValues(alpha: 0.35),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(999),
                            ),
                          ),
                          onPressed: isSending
                              ? null
                              : () async {
                                  if (isSent) {
                                    Navigator.of(sheetContext).pop();
                                    return;
                                  }
                                  if (resetEmailController.text.trim().isEmpty) return;
                                  setSheetState(() => isSending = true);
                                  await Future.delayed(const Duration(milliseconds: 800));
                                  if (!context.mounted) return;
                                  setSheetState(() {
                                    isSending = false;
                                    isSent = true;
                                  });
                                },
                          child: isSending
                              ? const SizedBox(
                                  width: 20,
                                  height: 20,
                                  child: CircularProgressIndicator(
                                    strokeWidth: 2.2,
                                    valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                                  ),
                                )
                              : Text(
                                  isSent ? 'Selesai' : 'Kirim Tautan',
                                  style: GoogleFonts.plusJakartaSans(
                                    fontSize: 14,
                                    fontWeight: FontWeight.w700,
                                  ),
                                ),
                        ),
                      ),

                      const SizedBox(height: 10),

                      // Secondary Cancel Action
                      Center(
                        child: TextButton(
                          onPressed: () => Navigator.of(sheetContext).pop(),
                          child: Text(
                            'Cancel',
                            style: GoogleFonts.plusJakartaSans(
                              fontSize: 13,
                              fontWeight: FontWeight.w600,
                              color: AppColors.textMuted,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            );
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;
    final topPadding = MediaQuery.of(context).padding.top;

    // Header height expands during transition to Dashboard
    final double baseHeaderHeight = (_isRegister ? 186.0 : 210.0) + topPadding;
    final double headerHeight = _isExpandingHeader ? size.height * 0.48 : baseHeaderHeight;

    return Scaffold(
      backgroundColor: AppColors.primaryDark,
      body: Stack(
        children: [
          // 1. Dark Purple Background with Subtle Bright Purple & Lemon Green Variations
          Container(
            width: double.infinity,
            height: double.infinity,
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  Color(0xFF1A0736),
                  Color(0xFF2E1065),
                  Color(0xFF4C1D95),
                ],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
            ),
          ),

          // 2. Curved White Content Sheet (slides down smoothly when entering Dashboard)
          AnimatedPositioned(
            duration: const Duration(milliseconds: 380),
            curve: Curves.easeInOutCubic,
            top: headerHeight - 30,
            left: 0,
            right: 0,
            bottom: _isExpandingHeader ? -size.height * 0.35 : 0,
            child: ClipPath(
              clipper: WhiteSheetCurveClipper(curveDepth: 30),
              child: Container(
                color: Colors.white,
                child: AnimatedOpacity(
                  opacity: _isExpandingHeader ? 0.0 : 1.0,
                  duration: const Duration(milliseconds: 220),
                  child: Padding(
                    padding: const EdgeInsets.only(top: 34),
                    child: SingleChildScrollView(
                      physics: const BouncingScrollPhysics(),
                      padding: const EdgeInsets.fromLTRB(24, 10, 24, 28),
                      child: AnimatedSwitcher(
                        duration: const Duration(milliseconds: 460),
                        switchInCurve: Curves.easeOutCubic,
                        switchOutCurve: Curves.easeInCubic,
                        layoutBuilder: (currentChild, previousChildren) {
                          return Stack(
                            alignment: Alignment.topCenter,
                            children: [
                              ...previousChildren,
                              if (currentChild != null) currentChild,
                            ],
                          );
                        },
                        transitionBuilder: (child, animation) {
                          final isReg = child.key == const ValueKey('register_form');
                          final tween = isReg
                              ? Tween<Offset>(
                                  begin: const Offset(1.0, 0.0),
                                  end: Offset.zero,
                                )
                              : Tween<Offset>(
                                  begin: const Offset(-1.0, 0.0),
                                  end: Offset.zero,
                                );

                          return SlideTransition(
                            position: tween.animate(animation),
                            child: FadeTransition(
                              opacity: animation,
                              child: child,
                            ),
                          );
                        },
                        child: _isRegister
                            ? _buildRegisterForm(key: const ValueKey('register_form'))
                            : _buildLoginForm(key: const ValueKey('login_form')),
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),

          // 3. Static Top-Left Header Content (stays anchored during Login <-> Register switch)
          Positioned(
            top: topPadding + 18,
            left: 24,
            right: 24,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Brand Title "ProjectMatch AI" gliding from center of Splash Screen via Hero
                const Row(
                  children: [
                    Hero(
                      tag: 'brand_logo_hero',
                      child: BrandLogoIcon(size: BrandSize.sm),
                    ),
                    SizedBox(width: 10),
                    Hero(
                      tag: 'brand_title_hero',
                      child: BrandTitle(
                        isDark: true,
                        size: BrandSize.md,
                        mainAxisSize: MainAxisSize.min,
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 18),

                // Greeting Text with smooth fade transition
                AnimatedOpacity(
                  opacity: _isExpandingHeader ? 0.0 : 1.0,
                  duration: const Duration(milliseconds: 200),
                  child: AnimatedSwitcher(
                    duration: const Duration(milliseconds: 320),
                    transitionBuilder: (child, animation) => FadeTransition(
                      opacity: animation,
                      child: child,
                    ),
                    child: _isRegister
                        ? Align(
                            key: const ValueKey('header_register'),
                            alignment: Alignment.centerLeft,
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'Buat Akun Baru',
                                  style: GoogleFonts.plusJakartaSans(
                                    fontSize: 22,
                                    fontWeight: FontWeight.w800,
                                    letterSpacing: -0.5,
                                    color: Colors.white,
                                  ),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  'Lengkapi profil akademik & repositori GitHub Anda',
                                  style: GoogleFonts.plusJakartaSans(
                                    fontSize: 12.5,
                                    color: const Color(0xFFE2D9F3),
                                  ),
                                ),
                              ],
                            ),
                          )
                        : Align(
                            key: const ValueKey('header_login'),
                            alignment: Alignment.centerLeft,
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'Selamat Datang Kembali!',
                                  style: GoogleFonts.plusJakartaSans(
                                    fontSize: 21,
                                    fontWeight: FontWeight.w800,
                                    letterSpacing: -0.5,
                                    color: Colors.white,
                                  ),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  'Silahkan Login Untuk Masuk',
                                  style: GoogleFonts.plusJakartaSans(
                                    fontSize: 13,
                                    fontWeight: FontWeight.w500,
                                    color: AppColors.accentLimeGlow,
                                  ),
                                ),
                              ],
                            ),
                          ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLoginForm({required Key key}) {
    return Column(
      key: key,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (_errorMessage != null) ...[
          _buildErrorBanner(_errorMessage!),
          const SizedBox(height: 14),
        ],

        // Email Field
        Text(
          'Email',
          style: GoogleFonts.plusJakartaSans(
            fontSize: 12.5,
            fontWeight: FontWeight.w700,
            color: AppColors.textHeadingLight,
          ),
        ),
        const SizedBox(height: 6),
        TextField(
          controller: _loginEmailController,
          keyboardType: TextInputType.emailAddress,
          style: GoogleFonts.plusJakartaSans(
            fontSize: 13.5,
            color: AppColors.textHeadingLight,
          ),
          decoration: const InputDecoration(
            prefixIcon: Icon(LucideIcons.mail, size: 17, color: AppColors.textMuted),
            hintText: 'nama@student.itb.ac.id',
          ),
        ),

        const SizedBox(height: 16),

        // Password Field
        Text(
          'Password',
          style: GoogleFonts.plusJakartaSans(
            fontSize: 12.5,
            fontWeight: FontWeight.w700,
            color: AppColors.textHeadingLight,
          ),
        ),
        const SizedBox(height: 6),
        TextField(
          controller: _loginPasswordController,
          obscureText: _obscureLoginPassword,
          style: GoogleFonts.plusJakartaSans(
            fontSize: 13.5,
            color: AppColors.textHeadingLight,
          ),
          decoration: InputDecoration(
            prefixIcon: const Icon(LucideIcons.lock, size: 17, color: AppColors.textMuted),
            suffixIcon: IconButton(
              icon: Icon(
                _obscureLoginPassword ? LucideIcons.eyeOff : LucideIcons.eye,
                size: 17,
                color: AppColors.textMuted,
              ),
              onPressed: () => setState(() => _obscureLoginPassword = !_obscureLoginPassword),
            ),
            hintText: 'Masukkan kata sandi',
          ),
        ),

        // Hyperlink "Lupa Sandi?" right-aligned below password
        Align(
          alignment: Alignment.centerRight,
          child: TextButton(
            onPressed: _showForgotPasswordSheet,
            style: TextButton.styleFrom(
              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 6),
              minimumSize: Size.zero,
              tapTargetSize: MaterialTapTargetSize.shrinkWrap,
            ),
            child: Text(
              'Lupa Sandi?',
              style: GoogleFonts.plusJakartaSans(
                fontSize: 12.5,
                fontWeight: FontWeight.w700,
                color: AppColors.primaryHeader,
              ),
            ),
          ),
        ),

        const SizedBox(height: 16),

        // Shape-Morphing Dark Purple Login Button
        _buildMorphingActionButton(
          label: 'Login',
          onTap: () => _submitAuth(),
        ),

        const SizedBox(height: 24),

        // Divider
        Row(
          children: [
            const Expanded(child: Divider(color: AppColors.borderLight)),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 12),
              child: Text(
                'atau masuk dengan',
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 11.5,
                  fontWeight: FontWeight.w500,
                  color: AppColors.textMuted,
                ),
              ),
            ),
            const Expanded(child: Divider(color: AppColors.borderLight)),
          ],
        ),

        const SizedBox(height: 18),

        // Horizontal Google & GitHub Buttons with distinctive brand icons
        Row(
          children: [
            Expanded(
              child: _buildSocialButton(
                label: 'Google',
                icon: const GoogleLogoIcon(size: 19),
                onTap: () => _submitAuth(isSocial: true),
              ),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: _buildSocialButton(
                label: 'GitHub',
                icon: const GithubLogoIcon(size: 19, color: Color(0xFF0F172A)),
                onTap: () => _submitAuth(isSocial: true),
              ),
            ),
          ],
        ),

        const SizedBox(height: 36),

        // Bottom Hyperlink: "Mahasiswa baru? Daftar akun di sini"
        Center(
          child: Wrap(
            alignment: WrapAlignment.center,
            crossAxisAlignment: WrapCrossAlignment.center,
            children: [
              Text(
                'Mahasiswa baru? ',
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 12.5,
                  color: AppColors.textBodyLight,
                ),
              ),
              TextButton(
                onPressed: () => _toggleAuthMode(true),
                style: TextButton.styleFrom(
                  padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 2),
                  minimumSize: Size.zero,
                  tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                ),
                child: Text(
                  'Daftar akun di sini',
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 12.5,
                    fontWeight: FontWeight.w800,
                    color: AppColors.primaryHeader,
                  ),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildRegisterForm({required Key key}) {
    return Column(
      key: key,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (_errorMessage != null) ...[
          _buildErrorBanner(_errorMessage!),
          const SizedBox(height: 12),
        ],

        // Staggered Input 1: Nama Lengkap Mahasiswa
        _staggeredField(
          index: 0,
          label: 'Nama Lengkap Mahasiswa',
          controller: _regNameController,
          hint: 'Contoh: Raden Satria',
          icon: LucideIcons.user,
        ),
        const SizedBox(height: 12),

        // Staggered Input 2: NIM
        _staggeredField(
          index: 1,
          label: 'Nomor Induk Mahasiswa (NIM)',
          controller: _regNimController,
          hint: 'Contoh: V3925028',
          icon: LucideIcons.bookOpen,
        ),
        const SizedBox(height: 12),

        // Staggered Input 3: Username GitHub Publik
        _staggeredField(
          index: 2,
          label: 'Username GitHub Publik',
          controller: _regGithubController,
          hint: 'Contoh: kho1rullll',
          icon: LucideIcons.gitBranch,
        ),
        const SizedBox(height: 12),

        // Staggered Input 4: Email
        _staggeredField(
          index: 3,
          label: 'Email',
          controller: _regEmailController,
          hint: 'nama@student.itb.ac.id',
          icon: LucideIcons.mail,
          keyboardType: TextInputType.emailAddress,
        ),
        const SizedBox(height: 12),

        // Staggered Input 5: Password
        _staggeredField(
          index: 4,
          label: 'Password',
          controller: _regPasswordController,
          hint: 'Minimal 8 karakter',
          icon: LucideIcons.lock,
          obscureText: _obscureRegPassword,
          onToggleObscure: () => setState(() => _obscureRegPassword = !_obscureRegPassword),
        ),
        const SizedBox(height: 12),

        // Staggered Input 6: Konfirmasi Password
        _staggeredField(
          index: 5,
          label: 'Konfirmasi Password',
          controller: _regConfirmPasswordController,
          hint: 'Ulangi password Anda',
          icon: LucideIcons.lock,
          obscureText: _obscureRegConfirmPassword,
          onToggleObscure: () =>
              setState(() => _obscureRegConfirmPassword = !_obscureRegConfirmPassword),
        ),

        const SizedBox(height: 22),

        // Shape-Morphing Dark Purple Register Button
        _buildMorphingActionButton(
          label: 'Daftar Akun',
          onTap: () => _submitAuth(),
        ).animate().fadeIn(delay: 260.ms, duration: 300.ms).slideY(begin: 0.15, end: 0),

        const SizedBox(height: 18),

        // Bottom Secondary Action: "Sudah memiliki akun? Masuk di sini"
        Center(
          child: Wrap(
            alignment: WrapAlignment.center,
            crossAxisAlignment: WrapCrossAlignment.center,
            children: [
              Text(
                'Sudah memiliki akun? ',
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 12.5,
                  color: AppColors.textBodyLight,
                ),
              ),
              TextButton(
                onPressed: () => _toggleAuthMode(false),
                style: TextButton.styleFrom(
                  padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 2),
                  minimumSize: Size.zero,
                  tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                ),
                child: Text(
                  'Masuk di sini',
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 12.5,
                    fontWeight: FontWeight.w800,
                    color: AppColors.primaryHeader,
                  ),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _staggeredField({
    required int index,
    required String label,
    required TextEditingController controller,
    required String hint,
    required IconData icon,
    TextInputType keyboardType = TextInputType.text,
    bool obscureText = false,
    VoidCallback? onToggleObscure,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: GoogleFonts.plusJakartaSans(
            fontSize: 12,
            fontWeight: FontWeight.w700,
            color: AppColors.textHeadingLight,
          ),
        ),
        const SizedBox(height: 5),
        TextField(
          controller: controller,
          keyboardType: keyboardType,
          obscureText: obscureText,
          style: GoogleFonts.plusJakartaSans(
            fontSize: 13.5,
            color: AppColors.textHeadingLight,
          ),
          decoration: InputDecoration(
            prefixIcon: Icon(icon, size: 16, color: AppColors.textMuted),
            suffixIcon: onToggleObscure != null
                ? IconButton(
                    icon: Icon(
                      obscureText ? LucideIcons.eyeOff : LucideIcons.eye,
                      size: 16,
                      color: AppColors.textMuted,
                    ),
                    onPressed: onToggleObscure,
                  )
                : null,
            hintText: hint,
          ),
        ),
      ],
    )
        .animate()
        .fadeIn(delay: (index * 45).ms, duration: 320.ms)
        .slideX(begin: 0.14, end: 0, curve: Curves.easeOutCubic);
  }

  Widget _buildMorphingActionButton({
    required String label,
    required VoidCallback onTap,
  }) {
    final double fullWidth = (MediaQuery.of(context).size.width - 48).clamp(120.0, 600.0);
    final double targetWidth = _isMorphingLoading ? 52.0 : fullWidth;

    return Center(
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 350),
        curve: Curves.easeInOutCubic,
        width: targetWidth,
        height: 52,
        decoration: BoxDecoration(
          color: AppColors.primarySolid,
          borderRadius: BorderRadius.circular(999),
          boxShadow: [
            BoxShadow(
              color: AppColors.primaryDark.withValues(alpha: 0.28),
              blurRadius: 14,
              offset: const Offset(0, 6),
            ),
          ],
        ),
        child: Material(
          color: Colors.transparent,
          child: InkWell(
            borderRadius: BorderRadius.circular(999),
            splashColor: AppColors.primary.withValues(alpha: 0.35),
            highlightColor: Colors.white.withValues(alpha: 0.10),
            onTap: _isMorphingLoading ? null : onTap,
            child: Center(
              child: _isMorphingLoading
                  ? const SizedBox(
                      width: 22,
                      height: 22,
                      child: CircularProgressIndicator(
                        strokeWidth: 2.5,
                        valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                      ),
                    )
                  : Text(
                      label,
                      maxLines: 1,
                      overflow: TextOverflow.fade,
                      softWrap: false,
                      style: GoogleFonts.plusJakartaSans(
                        fontSize: 14.5,
                        fontWeight: FontWeight.w700,
                        color: Colors.white,
                        letterSpacing: 0.2,
                      ),
                    ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildSocialButton({
    required String label,
    required Widget icon,
    required VoidCallback onTap,
  }) {
    return Material(
      color: Colors.white,
      borderRadius: BorderRadius.circular(999),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(999),
        child: Container(
          height: 48,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(999),
            border: Border.all(color: AppColors.borderInput, width: 1.1),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              icon,
              const SizedBox(width: 10),
              Text(
                label,
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 13.5,
                  fontWeight: FontWeight.w700,
                  color: AppColors.textHeadingLight,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildErrorBanner(String message) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
      decoration: BoxDecoration(
        color: const Color(0xFFFEF2F2),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.error.withValues(alpha: 0.4)),
      ),
      child: Row(
        children: [
          const Icon(LucideIcons.alertCircle, size: 16, color: AppColors.error),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              message,
              style: GoogleFonts.plusJakartaSans(
                fontSize: 12,
                fontWeight: FontWeight.w600,
                color: const Color(0xFFB91C1C),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

