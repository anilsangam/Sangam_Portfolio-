const mongoose = require('mongoose');
const Project = require('../models/Project');

/**
 * Service to handle Project queries and transformation for 3D Books Showcase
 */
class ProjectService {
  /**
   * Get published projects by category (or all if omitted)
   * @param {string} [category] - 'app', 'web', or null for all
   * @returns {Promise<Array>}
   */
  static async getPublishedProjects(category = null) {
    try {
      if (mongoose.connection.readyState !== 1) {
        return [];
      }

      const query = { isPublished: true };
      if (category) {
        query.category = category;
      }
      return await Project.find(query).sort({ order: 1, createdAt: -1 }).lean();
    } catch (err) {
      console.error('ProjectService.getPublishedProjects error:', err.message);
      return [];
    }
  }

  /**
   * Format MongoDB projects into BookCfg items for the 3D Books Showcase
   * @param {Array} projects - Raw project objects
   * @param {Object} [profile] - Profile data for author & links
   * @returns {Array} Array of BookCfg objects
   */
  static formatForBooksShowcase(projects = [], profile = {}) {
    const authorName = (profile && profile.fullName) || '';

    // Palette of complementary luxury cover tones for books
    const coverPalettes = [
      { bg: '#1c2237', spineBg: '#141829', backBg: '#1c2237', edge: '#eee4cf', ink: '#d5d1c8' },
      { bg: '#2b1e2c', spineBg: '#1e141f', backBg: '#2b1e2c', edge: '#f3ebd9', ink: '#d5d1c8' },
      { bg: '#192b23', spineBg: '#111e18', backBg: '#192b23', edge: '#ecdfc8', ink: '#d5d1c8' },
      { bg: '#2f241a', spineBg: '#201811', backBg: '#2f241a', edge: '#f2e8d3', ink: '#d5d1c8' },
      { bg: '#1c2938', spineBg: '#131e2b', backBg: '#1c2938', edge: '#ede3cb', ink: '#d5d1c8' }
    ];

    return projects.map((p, idx) => {
      const pal = coverPalettes[idx % coverPalettes.length];
      const year = p.createdAt ? new Date(p.createdAt).getFullYear().toString() : '2025';

      let frontImg = null;
      if (p.poster) {
        frontImg = p.poster.startsWith('/') || p.poster.startsWith('http') ? p.poster : '/images/' + p.poster;
      } else if (p.shot) {
        frontImg = p.shot.startsWith('/') || p.shot.startsWith('http') ? p.shot : '/images/' + p.shot;
      }

      let mobileShot = null;
      if (p.shot) {
        mobileShot = p.shot.startsWith('/') || p.shot.startsWith('http') ? p.shot : '/images/' + p.shot;
      } else if (p.poster) {
        mobileShot = p.poster.startsWith('/') || p.poster.startsWith('http') ? p.poster : '/images/' + p.poster;
      } else {
        mobileShot = p.category === 'app' ? '/images/app-expense.webp' : '/images/project-2.webp';
      }

      const iconImg = p.icon ? (p.icon.startsWith('/') || p.icon.startsWith('http') ? p.icon : '/images/' + p.icon) : '/images/icon-expense.webp';

      const chapters = (p.tags && p.tags.length > 0)
        ? p.tags
        : ['Architecture & Setup', 'UI Design & Flow', 'State Management', 'REST API Integration', 'Security & Auth', 'Testing & Launch'];

      // Resolve project URL / live demo link
      let projectUrl = p.url || '';
      if (!projectUrl) {
        if (p.title && p.title.toLowerCase().includes('nishad')) {
          projectUrl = 'https://nishadaarakshansankalp.in';
        } else if (p.title && p.title.toLowerCase().includes('ridtech')) {
          projectUrl = 'https://ridtech.in';
        } else {
          projectUrl = '';
        }
      }

      return {
        id: (p._id ? p._id.toString() : 'proj-' + (idx + 1)),
        title: p.title,
        subTitle: p.subTitle || '',
        author: authorName,
        year: year,
        stars: 5,
        desc: p.desc || p.subTitle || 'Production-grade application designed and developed with clean architecture, robust state management, and modern user experience.',
        category: p.category || 'app',
        kind: p.kind || (p.category === 'app' ? 'Mobile Application' : 'Web Application'),
        tags: p.tags || [],
        chapters: chapters,
        url: projectUrl,
        coverURL: frontImg,
        images: {
          front: frontImg || undefined,
          back: undefined,
          spine: undefined
        },
        desktopImage: p.desktopImage ? ((p.desktopImage.startsWith('/') || p.desktopImage.startsWith('http')) ? p.desktopImage : '/images/' + p.desktopImage) : null,
        mobileScreenshot: mobileShot,
        icon: iconImg,
        edge: pal.edge,
        spineBg: pal.spineBg,
        spineInk: '#ffffff',
        backBg: pal.backBg,
        backInk: '255,255,255',
        themeInk: pal.ink
      };
    });
  }
}

module.exports = ProjectService;
