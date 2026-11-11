import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../core/theme/app_colors.dart';
import '../../core/widgets/curved_header_clipper.dart';

class ProjectsPage extends StatefulWidget {
  const ProjectsPage({super.key});

  @override
  State<ProjectsPage> createState() => _ProjectsPageState();
}

class _ProjectsPageState extends State<ProjectsPage> {
  final _searchController = TextEditingController();
  int _selectedFilter = 0;

  final List<String> _filters = [
    'Semua',
    'Machine Learning',
    'Backend',
    'Frontend / Mobile',
    'IoT Devices',
  ];

  final List<Map<String, dynamic>> _allProjects = [
    {
      'id': 'p1',
      'title': 'Autonomous Vision AI Quality Inspection',
      'company': 'PT Industri Cerdas Nusantara',
      'location': 'Jakarta (Remote)',
      'match': 98,
      'category': 'Machine Learning',
      'stipend': 'Rp 4.500.000 / bln',
      'duration': '4 Bulan',
      'tags': ['PyTorch', 'OpenCV', 'FastAPI'],
      'desc': 'Pengembangan sistem computer vision berbasis deep learning untuk mendeteksi cacat produksi pada jalur perakitan otomatis.',
    },
    {
      'id': 'p2',
      'title': 'High-Throughput Payment Ledger Microservice',
      'company': 'Bank Digital Mandiri',
      'location': 'Bandung (Hybrid)',
      'match': 95,
      'category': 'Backend',
      'stipend': 'Rp 5.000.000 / bln',
      'duration': '6 Bulan',
      'tags': ['Golang', 'Redis', 'PostgreSQL'],
      'desc': 'Arsitektur microservice transaksi finansial terdistribusi dengan toleransi kesalahan tinggi dan benchmark 3,500 QPS.',
    },
    {
      'id': 'p3',
      'title': 'Clinical NER Diagnostic Assistant',
      'company': 'BioInformatika Nusantara',
      'location': 'Jakarta (Remote)',
      'match': 96,
      'category': 'Machine Learning',
      'stipend': 'Rp 4.800.000 / bln',
      'duration': '3 Bulan',
      'tags': ['Transformers', 'HuggingFace', 'Python'],
      'desc': 'Ekstraksi entitas medis klinis dari resume medis menggunakan transformer model fine-tuned berbahasa Indonesia.',
    },
    {
      'id': 'p4',
      'title': 'Smart Campus Telemetry IoT Dashboard',
      'company': 'Lab Inovasi UNS',
      'location': 'Surakarta (Onsite)',
      'match': 92,
      'category': 'IoT Devices',
      'stipend': 'Rp 3.800.000 / bln',
      'duration': '5 Bulan',
      'tags': ['Next.js', 'MQTT', 'TypeScript'],
      'desc': 'Integrasi telemetry real-time dari 50+ sensor energi kampus dengan latency transmisi data di bawah 45ms.',
    },
    {
      'id': 'p5',
      'title': 'Cross-Platform Mobile App for Farmer Logistics',
      'company': 'AgroTech Digital Lestari',
      'location': 'Yogyakarta (Remote)',
      'match': 89,
      'category': 'Frontend / Mobile',
      'stipend': 'Rp 4.200.000 / bln',
      'duration': '4 Bulan',
      'tags': ['Flutter', 'Riverpod', 'Dart'],
      'desc': 'Aplikasi mobile logistik hasil tani dengan peta interaktif dan sinkronisasi data offline-first.',
    },
  ];

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _showApplyModal(Map<String, dynamic> project) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => Container(
        padding: const EdgeInsets.all(24),
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(32)),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: AppColors.accentLime,
                    borderRadius: BorderRadius.circular(999),
                  ),
                  child: Text(
                    '${project['match']}% Match',
                    style: GoogleFonts.plusJakartaSans(
                      fontSize: 10.5,
                      fontWeight: FontWeight.w900,
                      color: const Color(0xFF0F172A),
                    ),
                  ),
                ),
                IconButton(
                  icon: const Icon(LucideIcons.x, color: AppColors.textMuted, size: 18),
                  onPressed: () => Navigator.pop(context),
                ),
              ],
            ),
            const SizedBox(height: 10),
            Text(
              project['title'] as String,
              style: GoogleFonts.plusJakartaSans(
                fontSize: 18,
                fontWeight: FontWeight.w800,
                color: AppColors.textHeadingLight,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              '${project['company']} • ${project['location']}',
              style: GoogleFonts.plusJakartaSans(
                fontSize: 12,
                color: AppColors.textMuted,
              ),
            ),
            const SizedBox(height: 14),
            Text(
              project['desc'] as String,
              style: GoogleFonts.plusJakartaSans(
                fontSize: 12.5,
                color: AppColors.textBodyLight,
                height: 1.5,
              ),
            ),
            const SizedBox(height: 18),
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: AppColors.canvasLight,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.borderLight),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  Column(
                    children: [
                      Text('Uang Saku / Honor',
                          style: GoogleFonts.plusJakartaSans(fontSize: 10, color: AppColors.textMuted)),
                      Text(
                        project['stipend'] as String,
                        style: GoogleFonts.plusJakartaSans(
                          fontSize: 12.5,
                          fontWeight: FontWeight.w800,
                          color: AppColors.accentLimeDark,
                        ),
                      ),
                    ],
                  ),
                  Container(width: 1, height: 24, color: AppColors.borderLight),
                  Column(
                    children: [
                      Text('Durasi Proyek',
                          style: GoogleFonts.plusJakartaSans(fontSize: 10, color: AppColors.textMuted)),
                      Text(
                        project['duration'] as String,
                        style: GoogleFonts.plusJakartaSans(
                          fontSize: 12.5,
                          fontWeight: FontWeight.w800,
                          color: AppColors.textHeadingLight,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 22),
            SizedBox(
              width: double.infinity,
              height: 50,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primarySolid,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(999)),
                ),
                onPressed: () {
                  Navigator.pop(context);
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text(
                        'Lamaran berhasil dikirim dengan menyertakan portofolio GitHub Anda!',
                        style: GoogleFonts.plusJakartaSans(fontSize: 12),
                      ),
                      backgroundColor: AppColors.primarySolid,
                    ),
                  );
                },
                child: Text(
                  'Kirim Lamaran dengan Portofolio GitHub',
                  style: GoogleFonts.plusJakartaSans(
                    fontWeight: FontWeight.w700,
                    fontSize: 13,
                  ),
                ),
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
    final query = _searchController.text.toLowerCase();
    final selectedFilterName = _filters[_selectedFilter];

    final filteredProjects = _allProjects.where((p) {
      final matchesSearch = p['title'].toString().toLowerCase().contains(query) ||
          p['company'].toString().toLowerCase().contains(query);
      final matchesCategory = _selectedFilter == 0 || p['category'] == selectedFilterName;
      return matchesSearch && matchesCategory;
    }).toList();

    return Container(
      color: AppColors.canvasLight,
      child: CustomScrollView(
        physics: const BouncingScrollPhysics(),
        slivers: [
          SliverToBoxAdapter(
            child: Container(
              padding: EdgeInsets.fromLTRB(20, topPadding + 16, 20, 20),
              decoration: const BoxDecoration(
                gradient: AppColors.headerPurpleGradient,
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Eksplorasi Proyek Mitra',
                    style: GoogleFonts.plusJakartaSans(
                      fontSize: 20,
                      fontWeight: FontWeight.w800,
                      letterSpacing: -0.5,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Lowongan berbasis riset industri & pengembangan riil',
                    style: GoogleFonts.plusJakartaSans(
                      fontSize: 12,
                      color: const Color(0xFFE2D9F3),
                    ),
                  ),
                ],
              ),
            ),
          ),
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
                      TextField(
                        controller: _searchController,
                        onChanged: (val) => setState(() {}),
                        style: GoogleFonts.plusJakartaSans(
                          fontSize: 13.5,
                          color: AppColors.textHeadingLight,
                        ),
                        decoration: InputDecoration(
                          prefixIcon: const Icon(LucideIcons.search, size: 17, color: AppColors.textMuted),
                          hintText: 'Cari proyek, teknologi, atau nama mitra...',
                          suffixIcon: _searchController.text.isNotEmpty
                              ? IconButton(
                                  icon: const Icon(LucideIcons.x, size: 16, color: AppColors.textMuted),
                                  onPressed: () {
                                    _searchController.clear();
                                    setState(() {});
                                  },
                                )
                              : null,
                        ),
                      ),

                      const SizedBox(height: 14),

                      SingleChildScrollView(
                        scrollDirection: Axis.horizontal,
                        child: Row(
                          children: List.generate(_filters.length, (index) {
                            final isSelected = _selectedFilter == index;
                            return Padding(
                              padding: const EdgeInsets.only(right: 8),
                              child: GestureDetector(
                                onTap: () => setState(() => _selectedFilter = index),
                                child: Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                                  decoration: BoxDecoration(
                                    color: isSelected ? AppColors.primarySolid : Colors.white,
                                    borderRadius: BorderRadius.circular(999),
                                    border: Border.all(
                                      color: isSelected ? AppColors.accentLime : AppColors.borderLight,
                                    ),
                                  ),
                                  child: Text(
                                    _filters[index],
                                    style: GoogleFonts.plusJakartaSans(
                                      fontSize: 11.5,
                                      fontWeight: isSelected ? FontWeight.w700 : FontWeight.w600,
                                      color: isSelected ? Colors.white : AppColors.textBodyLight,
                                    ),
                                  ),
                                ),
                              ),
                            );
                          }),
                        ),
                      ),

                      const SizedBox(height: 18),

                      Text(
                        'Menampilkan ${filteredProjects.length} Proyek Tersedia',
                        style: GoogleFonts.plusJakartaSans(
                          fontSize: 11.5,
                          fontWeight: FontWeight.w700,
                          color: AppColors.textMuted,
                        ),
                      ),

                      const SizedBox(height: 12),

                      ...filteredProjects.map((project) {
                        return Padding(
                          padding: const EdgeInsets.only(bottom: 12),
                          child: Material(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(20),
                            child: InkWell(
                              onTap: () => _showApplyModal(project),
                              borderRadius: BorderRadius.circular(20),
                              child: Container(
                                padding: const EdgeInsets.all(16),
                                decoration: BoxDecoration(
                                  borderRadius: BorderRadius.circular(20),
                                  border: Border.all(color: AppColors.borderLight),
                                ),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Row(
                                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                      children: [
                                        Container(
                                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                          decoration: BoxDecoration(
                                            color: AppColors.bgLightSubtle,
                                            borderRadius: BorderRadius.circular(6),
                                          ),
                                          child: Text(
                                            project['category'] as String,
                                            style: GoogleFonts.plusJakartaSans(
                                              fontSize: 9.5,
                                              fontWeight: FontWeight.w700,
                                              color: AppColors.textBodyLight,
                                            ),
                                          ),
                                        ),
                                        Container(
                                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                          decoration: BoxDecoration(
                                            color: AppColors.accentLime,
                                            borderRadius: BorderRadius.circular(999),
                                          ),
                                          child: Text(
                                            '${project['match']}% Match',
                                            style: GoogleFonts.plusJakartaSans(
                                              fontSize: 10,
                                              fontWeight: FontWeight.w900,
                                              color: const Color(0xFF0F172A),
                                            ),
                                          ),
                                        ),
                                      ],
                                    ),
                                    const SizedBox(height: 8),
                                    Text(
                                      project['title'] as String,
                                      style: GoogleFonts.plusJakartaSans(
                                        fontSize: 14,
                                        fontWeight: FontWeight.w800,
                                        color: AppColors.textHeadingLight,
                                      ),
                                    ),
                                    const SizedBox(height: 2),
                                    Text(
                                      '${project['company']} • ${project['location']}',
                                      style: GoogleFonts.plusJakartaSans(
                                        fontSize: 11,
                                        color: AppColors.textMuted,
                                      ),
                                    ),
                                    const SizedBox(height: 10),
                                    Wrap(
                                      spacing: 4,
                                      children: (project['tags'] as List<String>).map((tag) {
                                        return Container(
                                          padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2.5),
                                          decoration: BoxDecoration(
                                            color: AppColors.primaryLight,
                                            borderRadius: BorderRadius.circular(6),
                                          ),
                                          child: Text(
                                            tag,
                                            style: GoogleFonts.plusJakartaSans(
                                              fontSize: 9.5,
                                              fontWeight: FontWeight.w700,
                                              color: AppColors.primaryDark,
                                            ),
                                          ),
                                        );
                                      }).toList(),
                                    ),
                                    const SizedBox(height: 12),
                                    Row(
                                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                      children: [
                                        Text(
                                          project['stipend'] as String,
                                          style: GoogleFonts.plusJakartaSans(
                                            fontSize: 11.5,
                                            fontWeight: FontWeight.w800,
                                            color: AppColors.accentLimeDark,
                                          ),
                                        ),
                                        Text(
                                          'Ketuk untuk detail →',
                                          style: GoogleFonts.plusJakartaSans(
                                            fontSize: 10.5,
                                            fontWeight: FontWeight.w700,
                                            color: AppColors.primaryHeader,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ),
                        );
                      }),
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
}
