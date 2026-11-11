import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../core/theme/app_colors.dart';
import '../../core/widgets/curved_header_clipper.dart';
import '../auth/login_page.dart';

class ProfilePage extends StatefulWidget {
  final String userName;
  final String userNim;

  const ProfilePage({
    super.key,
    this.userName = 'Raden Satria',
    this.userNim = 'V3925028',
  });

  @override
  State<ProfilePage> createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {
  String _selectedTheme = 'Light Studio (Default)';

  final List<Map<String, dynamic>> _skillDimensions = [
    {'name': 'AI & Machine Learning', 'score': 92},
    {'name': 'Backend Development', 'score': 90},
    {'name': 'Frontend Engineering', 'score': 85},
    {'name': 'Cloud & Architecture', 'score': 84},
    {'name': 'UI/UX & Prototyping', 'score': 78},
  ];

  final List<String> _skillPillTags = [
    'PyTorch',
    'Transformers',
    'Next.js 15',
    'FastAPI',
    'Golang',
    'pgvector',
    'Docker',
    'Flutter',
    'TypeScript',
    'Figma',
    'Computer Vision',
    'Redis',
  ];

  final List<Map<String, String>> _repositories = [
    {
      'title': 'clinical-ner-diagnosis',
      'tech': 'PyTorch • HuggingFace • FastAPI',
      'stat': 'F1-Score 94.2%',
    },
    {
      'title': 'smart-campus-telemetry-iot',
      'tech': 'Next.js 15 • MQTT • WebSocket',
      'stat': 'Latency < 45ms',
    },
    {
      'title': 'payment-ledger-microservice',
      'tech': 'Golang • Redis • PostgreSQL',
      'stat': '3,500 QPS Benchmark',
    },
  ];

  String _getInitials(String name) {
    final parts = name.trim().split(RegExp(r'\s+'));
    if (parts.isEmpty) return 'RS';
    if (parts.length == 1) return parts[0].substring(0, parts[0].length >= 2 ? 2 : 1).toUpperCase();
    return '${parts[0][0]}${parts[1][0]}'.toUpperCase();
  }

  void _showLogoutDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: Colors.white,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(24),
        ),
        title: Text(
          'Keluar dari Akun?',
          style: GoogleFonts.plusJakartaSans(
            fontSize: 18,
            fontWeight: FontWeight.w800,
            color: AppColors.textHeadingLight,
          ),
        ),
        content: Text(
          'Apakah Anda yakin ingin keluar dari sesi ProjectMatch AI ini?',
          style: GoogleFonts.plusJakartaSans(
            fontSize: 13,
            color: AppColors.textBodyLight,
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text(
              'Batal',
              style: GoogleFonts.plusJakartaSans(
                fontWeight: FontWeight.w700,
                color: AppColors.textMuted,
              ),
            ),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.error,
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
            onPressed: () {
              Navigator.pop(context);
              Navigator.of(context).pushAndRemoveUntil(
                MaterialPageRoute(builder: (context) => const LoginPage()),
                (route) => false,
              );
            },
            child: Text(
              'Ya, Keluar',
              style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w700),
            ),
          ),
        ],
      ),
    );
  }

  void _showThemeSelector() {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (context) => StatefulBuilder(
        builder: (context, setModalState) => Container(
          padding: const EdgeInsets.all(24),
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Pilih Tema Aplikasi',
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 16,
                  fontWeight: FontWeight.w800,
                  color: AppColors.textHeadingLight,
                ),
              ),
              const SizedBox(height: 16),
              _buildThemeOption(
                'Light Studio (Default)',
                'Latar putih bersih dengan header ungu gelap',
                'Light Studio (Default)',
                setModalState,
              ),
              const SizedBox(height: 8),
              _buildThemeOption(
                'Dark Navy (Obsidian)',
                'Tema gelap kontras tinggi dengan aksen lime',
                'Dark Navy (Obsidian)',
                setModalState,
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildThemeOption(
      String title, String desc, String value, StateSetter setModalState) {
    final isSelected = _selectedTheme == value;
    return GestureDetector(
      onTap: () {
        setModalState(() => _selectedTheme = value);
        setState(() => _selectedTheme = value);
        Navigator.pop(context);
      },
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        decoration: BoxDecoration(
          color: isSelected ? AppColors.primaryLight : AppColors.canvasLight,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: isSelected ? AppColors.primaryHeader : AppColors.borderLight,
            width: 1.2,
          ),
        ),
        child: Row(
          children: [
            Icon(
              isSelected ? LucideIcons.checkCircle2 : LucideIcons.circle,
              color: isSelected ? AppColors.primaryHeader : AppColors.textMuted,
              size: 18,
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: GoogleFonts.plusJakartaSans(
                      fontSize: 13,
                      fontWeight: FontWeight.w700,
                      color: AppColors.textHeadingLight,
                    ),
                  ),
                  Text(
                    desc,
                    style: GoogleFonts.plusJakartaSans(
                      fontSize: 11,
                      color: AppColors.textMuted,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final topPadding = MediaQuery.of(context).padding.top;

    return Container(
      color: AppColors.canvasLight,
      child: CustomScrollView(
        physics: const BouncingScrollPhysics(),
        slivers: [
          // Dark Purple Profile Header
          SliverToBoxAdapter(
            child: Container(
              padding: EdgeInsets.fromLTRB(20, topPadding + 16, 20, 24),
              decoration: const BoxDecoration(
                gradient: AppColors.headerPurpleGradient,
              ),
              child: Row(
                children: [
                  Container(
                    width: 68,
                    height: 68,
                    decoration: const BoxDecoration(
                      shape: BoxShape.circle,
                      gradient: LinearGradient(
                        colors: [AppColors.accentLimeGlow, AppColors.primary],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                    ),
                    padding: const EdgeInsets.all(3),
                    child: Container(
                      decoration: const BoxDecoration(
                        shape: BoxShape.circle,
                        color: AppColors.primaryDarkDeep,
                      ),
                      alignment: Alignment.center,
                      child: Text(
                        _getInitials(widget.userName),
                        style: GoogleFonts.plusJakartaSans(
                          fontSize: 22,
                          fontWeight: FontWeight.w900,
                          color: Colors.white,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Flexible(
                              child: Text(
                                widget.userName,
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: GoogleFonts.plusJakartaSans(
                                  fontSize: 18,
                                  fontWeight: FontWeight.w800,
                                  color: Colors.white,
                                ),
                              ),
                            ),
                            const SizedBox(width: 6),
                            Container(
                              padding: const EdgeInsets.all(3),
                              decoration: const BoxDecoration(
                                color: AppColors.accentLime,
                                shape: BoxShape.circle,
                              ),
                              child: const Icon(LucideIcons.check, size: 10, color: Colors.black),
                            ),
                          ],
                        ),
                        const SizedBox(height: 3),
                        Text(
                          'NIM: ${widget.userNim} • D3 Teknik Informatika',
                          style: GoogleFonts.plusJakartaSans(
                            fontSize: 11.5,
                            fontWeight: FontWeight.w600,
                            color: AppColors.accentLimeGlow,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          'PSDKU Madiun, Univ. Sebelas Maret (UNS)',
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: GoogleFonts.plusJakartaSans(
                            fontSize: 10.5,
                            color: const Color(0xFFE2D9F3),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Curved Light Canvas Body
          SliverToBoxAdapter(
            child: Container(
              color: AppColors.primaryHeader,
              child: ClipPath(
                clipper: WhiteSheetCurveClipper(curveDepth: 20),
                child: Container(
                  color: AppColors.canvasLight,
                  padding: const EdgeInsets.fromLTRB(20, 28, 20, 110),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Profile Completion Card
                      Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: AppColors.borderLight),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(
                                  'Kelengkapan Profil Portofolio',
                                  style: GoogleFonts.plusJakartaSans(
                                    fontSize: 12,
                                    fontWeight: FontWeight.w700,
                                    color: AppColors.textHeadingLight,
                                  ),
                                ),
                                Text(
                                  '85% Selesai',
                                  style: GoogleFonts.plusJakartaSans(
                                    fontSize: 12,
                                    fontWeight: FontWeight.w800,
                                    color: AppColors.accentLimeDark,
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 8),
                            ClipRRect(
                              borderRadius: BorderRadius.circular(999),
                              child: const LinearProgressIndicator(
                                value: 0.85,
                                minHeight: 7,
                                backgroundColor: AppColors.bgLightSubtle,
                                valueColor: AlwaysStoppedAnimation<Color>(AppColors.accentLime),
                              ),
                            ),
                            const SizedBox(height: 8),
                            Text(
                              'IPK 3.88 • KTM RFID 0x8F3A29B1 (Terverifikasi) • @kho1rullll',
                              style: GoogleFonts.plusJakartaSans(
                                fontSize: 10,
                                color: AppColors.textMuted,
                              ),
                            ),
                          ],
                        ),
                      ),

                      const SizedBox(height: 22),

                      // Keahlian (Skills) Tags Pills
                      Text(
                        'Keahlian & Tag Teknologi',
                        style: GoogleFonts.plusJakartaSans(
                          fontSize: 16,
                          fontWeight: FontWeight.w800,
                          color: AppColors.textHeadingLight,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Diekstrak dari 18 repositori GitHub publik',
                        style: GoogleFonts.plusJakartaSans(
                          fontSize: 11.5,
                          color: AppColors.textMuted,
                        ),
                      ),
                      const SizedBox(height: 12),

                      Wrap(
                        spacing: 8,
                        runSpacing: 8,
                        children: _skillPillTags.map((tag) {
                          return Container(
                            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 7),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(999),
                              border: Border.all(color: AppColors.borderLight),
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Container(
                                  width: 6,
                                  height: 6,
                                  decoration: const BoxDecoration(
                                    color: AppColors.accentLime,
                                    shape: BoxShape.circle,
                                  ),
                                ),
                                const SizedBox(width: 6),
                                Text(
                                  tag,
                                  style: GoogleFonts.plusJakartaSans(
                                    fontSize: 11.5,
                                    fontWeight: FontWeight.w600,
                                    color: AppColors.textHeadingLight,
                                  ),
                                ),
                              ],
                            ),
                          );
                        }).toList(),
                      ),

                      const SizedBox(height: 22),

                      // 5-D Competency Card
                      Text(
                        'Kompetensi 5-Dimensi',
                        style: GoogleFonts.plusJakartaSans(
                          fontSize: 16,
                          fontWeight: FontWeight.w800,
                          color: AppColors.textHeadingLight,
                        ),
                      ),
                      const SizedBox(height: 12),
                      Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: AppColors.borderLight),
                        ),
                        child: Column(
                          children: _skillDimensions.map((dim) {
                            final score = dim['score'] as int;
                            return Padding(
                              padding: const EdgeInsets.only(bottom: 12),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                    children: [
                                      Text(
                                        dim['name'] as String,
                                        style: GoogleFonts.plusJakartaSans(
                                          fontSize: 12,
                                          fontWeight: FontWeight.w700,
                                          color: AppColors.textHeadingLight,
                                        ),
                                      ),
                                      Text(
                                        '$score%',
                                        style: GoogleFonts.plusJakartaSans(
                                          fontSize: 12,
                                          fontWeight: FontWeight.w800,
                                          color: AppColors.primaryHeader,
                                        ),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 5),
                                  ClipRRect(
                                    borderRadius: BorderRadius.circular(999),
                                    child: LinearProgressIndicator(
                                      value: score / 100,
                                      minHeight: 6,
                                      backgroundColor: AppColors.bgLightSubtle,
                                      valueColor: AlwaysStoppedAnimation<Color>(
                                        score >= 90 ? AppColors.accentLime : AppColors.primaryHeader,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            );
                          }).toList(),
                        ),
                      ),

                      const SizedBox(height: 22),

                      // Repositories
                      Text(
                        'Repositori Unggulan GitHub',
                        style: GoogleFonts.plusJakartaSans(
                          fontSize: 16,
                          fontWeight: FontWeight.w800,
                          color: AppColors.textHeadingLight,
                        ),
                      ),
                      const SizedBox(height: 12),
                      ..._repositories.map((repo) => Padding(
                            padding: const EdgeInsets.only(bottom: 10),
                            child: Container(
                              padding: const EdgeInsets.all(14),
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(18),
                                border: Border.all(color: AppColors.borderLight),
                              ),
                              child: Row(
                                children: [
                                  Container(
                                    padding: const EdgeInsets.all(8),
                                    decoration: BoxDecoration(
                                      color: AppColors.primaryLight,
                                      borderRadius: BorderRadius.circular(12),
                                    ),
                                    child: const Icon(
                                      LucideIcons.gitBranch,
                                      size: 16,
                                      color: AppColors.primaryDark,
                                    ),
                                  ),
                                  const SizedBox(width: 12),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          repo['title']!,
                                          style: GoogleFonts.jetBrainsMono(
                                            fontSize: 12,
                                            fontWeight: FontWeight.w700,
                                            color: AppColors.textHeadingLight,
                                          ),
                                        ),
                                        const SizedBox(height: 2),
                                        Text(
                                          repo['tech']!,
                                          style: GoogleFonts.plusJakartaSans(
                                            fontSize: 10.5,
                                            color: AppColors.textMuted,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                    decoration: BoxDecoration(
                                      color: AppColors.accentLimeLight,
                                      borderRadius: BorderRadius.circular(999),
                                    ),
                                    child: Text(
                                      repo['stat']!,
                                      style: GoogleFonts.plusJakartaSans(
                                        fontSize: 9.5,
                                        fontWeight: FontWeight.w800,
                                        color: AppColors.accentLimeDark,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          )),

                      const SizedBox(height: 22),

                      // Menu Pengaturan Vertikal
                      Text(
                        'Pengaturan & Preferensi',
                        style: GoogleFonts.plusJakartaSans(
                          fontSize: 16,
                          fontWeight: FontWeight.w800,
                          color: AppColors.textHeadingLight,
                        ),
                      ),
                      const SizedBox(height: 12),
                      Container(
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: AppColors.borderLight),
                        ),
                        child: Column(
                          children: [
                            _buildMenuRow(
                              icon: LucideIcons.settings,
                              title: 'Pengaturan Akun',
                              subtitle: 'Kelola biodata, NIM & tautan GitHub',
                              onTap: () {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(
                                    content: Text(
                                      'Pengaturan Akun & Biodata dibuka.',
                                      style: GoogleFonts.plusJakartaSans(fontSize: 12),
                                    ),
                                    backgroundColor: AppColors.primarySolid,
                                  ),
                                );
                              },
                            ),
                            const Divider(height: 1, color: AppColors.borderLight),
                            _buildMenuRow(
                              icon: LucideIcons.palette,
                              title: 'Tema Aplikasi',
                              subtitle: _selectedTheme,
                              onTap: _showThemeSelector,
                            ),
                            const Divider(height: 1, color: AppColors.borderLight),
                            _buildMenuRow(
                              icon: LucideIcons.helpCircle,
                              title: 'Bantuan & Panduan Magang',
                              subtitle: 'FAQ alur matching, kontrak & mentoring',
                              onTap: () {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(
                                    content: Text(
                                      'Pusat Bantuan & FAQ dibuka.',
                                      style: GoogleFonts.plusJakartaSans(fontSize: 12),
                                    ),
                                    backgroundColor: AppColors.primarySolid,
                                  ),
                                );
                              },
                            ),
                            const Divider(height: 1, color: AppColors.borderLight),
                            _buildMenuRow(
                              icon: LucideIcons.logOut,
                              title: 'Keluar dari Akun',
                              subtitle: 'Akhiri sesi pada perangkat ini',
                              iconColor: AppColors.error,
                              iconBg: const Color(0xFFFEF2F2),
                              textColor: const Color(0xFFB91C1C),
                              onTap: _showLogoutDialog,
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMenuRow({
    required IconData icon,
    required String title,
    required String subtitle,
    required VoidCallback onTap,
    Color? iconColor,
    Color? iconBg,
    Color? textColor,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(20),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: iconBg ?? AppColors.primaryLight,
                borderRadius: BorderRadius.circular(10),
              ),
              child: Icon(icon, size: 16, color: iconColor ?? AppColors.primaryDark),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: GoogleFonts.plusJakartaSans(
                      fontSize: 13,
                      fontWeight: FontWeight.w700,
                      color: textColor ?? AppColors.textHeadingLight,
                    ),
                  ),
                  const SizedBox(height: 1),
                  Text(
                    subtitle,
                    style: GoogleFonts.plusJakartaSans(
                      fontSize: 10.5,
                      color: AppColors.textMuted,
                    ),
                  ),
                ],
              ),
            ),
            const Icon(LucideIcons.chevronRight, size: 16, color: AppColors.textMuted),
          ],
        ),
      ),
    );
  }
}
