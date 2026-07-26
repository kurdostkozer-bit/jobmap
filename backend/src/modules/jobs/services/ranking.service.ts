import { Injectable } from '@nestjs/common';

export interface JobScore {
  jobId: string;
  relevanceScore: number;
  salaryScore: number;
  recencyScore: number;
  popularityScore: number;
  finalScore: number;
}

@Injectable()
export class RankingService {
  /**
   * Calculate salary score (0-1)
   * Higher salary = higher score
   */
  private calculateSalaryScore(salaryMin: number, salaryMax: number): number {
    if (!salaryMin || !salaryMax) return 0.3; // Base score if no salary
    
    // Normalize to Iraq's salary range (1M - 10M IQD)
    const avgSalary = (salaryMin + salaryMax) / 2;
    const normalizedScore = Math.min(avgSalary / 10000000, 1);
    return normalizedScore;
  }

  /**
   * Calculate recency score (0-1)
   * More recent = higher score
   */
  private calculateRecencyScore(createdAt: Date): number {
    const now = new Date();
    const ageInDays = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
    
    // Decay: 1.0 (today) -> 0.5 (30 days) -> 0.1 (365 days)
    const decayFactor = Math.exp(-ageInDays / 60);
    return Math.max(decayFactor, 0.1);
  }

  /**
   * Calculate popularity score (0-1)
   * More applicants = higher score
   */
  private calculatePopularityScore(applicantsCount: number): number {
    // Normalize applicants (0-100 scale)
    const normalizedCount = Math.min(applicantsCount / 100, 1);
    return normalizedCount;
  }

  /**
   * Calculate experience level alignment score (0-1)
   * Matches job seeker's experience to opportunity
   */
  private calculateExperienceLevelScore(
    jobLevel: string,
    userLevel: string,
  ): number {
    const levels = ['Entry', 'Mid', 'Senior'];
    const jobIndex = levels.indexOf(jobLevel) || 0;
    const userIndex = levels.indexOf(userLevel) || 1;
    
    // Exact match = 1.0, one level difference = 0.7, two+ = 0.3
    const diff = Math.abs(jobIndex - userIndex);
    if (diff === 0) return 1.0;
    if (diff === 1) return 0.7;
    return 0.3;
  }

  /**
   * Calculate skills match score (0-1)
   * Matches job requirements to user skills
   */
  private calculateSkillsMatchScore(
    requiredSkills: string[],
    userSkills: string[],
  ): number {
    if (!requiredSkills || requiredSkills.length === 0) return 0.5; // No requirements
    if (!userSkills || userSkills.length === 0) return 0.2;

    const matchCount = requiredSkills.filter((skill) =>
      userSkills.some(
        (userSkill) =>
          userSkill.toLowerCase().includes(skill.toLowerCase()) ||
          skill.toLowerCase().includes(userSkill.toLowerCase())
      )
    ).length;

    return matchCount / requiredSkills.length;
  }

  /**
   * Calculate final relevance score for a job
   * 
   * Weights:
   * - Salary: 25% (career growth indicator)
   * - Recency: 25% (freshness of opportunity)
   * - Popularity: 15% (job market demand)
   * - Skills match: 20% (qualification fit)
   * - Experience level: 15% (career stage fit)
   */
  calculateRelevanceScore(job: any, userProfile?: any): number {
    const salaryScore = this.calculateSalaryScore(job.salaryMin, job.salaryMax);
    const recencyScore = this.calculateRecencyScore(new Date(job.createdAt));
    const popularityScore = this.calculatePopularityScore(job.applicantsCount || 0);

    // User-specific scoring (if profile provided)
    let skillsScore = 0.5; // Default
    let experienceScore = 0.5; // Default

    if (userProfile) {
      skillsScore = this.calculateSkillsMatchScore(job.skills, userProfile.skills);
      experienceScore = this.calculateExperienceLevelScore(
        job.experienceLevel,
        userProfile.experienceLevel,
      );
    }

    // Weighted combination
    const finalScore =
      salaryScore * 0.25 +
      recencyScore * 0.25 +
      popularityScore * 0.15 +
      skillsScore * 0.20 +
      experienceScore * 0.15;

    return Math.round(finalScore * 100) / 100; // Round to 2 decimals
  }

  /**
   * Rank multiple jobs by relevance
   */
  rankJobs(jobs: any[], userProfile?: any): JobScore[] {
    return jobs
      .map((job) => ({
        jobId: job.id,
        relevanceScore: this.calculateRelevanceScore(job, userProfile),
        salaryScore: this.calculateSalaryScore(job.salaryMin, job.salaryMax),
        recencyScore: this.calculateRecencyScore(new Date(job.createdAt)),
        popularityScore: this.calculatePopularityScore(job.applicantsCount || 0),
        finalScore: this.calculateRelevanceScore(job, userProfile),
      }))
      .sort((a, b) => b.finalScore - a.finalScore); // Sort descending
  }
}
