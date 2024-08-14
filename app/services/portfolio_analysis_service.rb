class PortfolioAnalysisService
  def initialize(project)
    @project = project
  end

  def perform
    # ここで実際の分析ロジックを実装します
    # この例では、ダミーデータを返しています
    {
      overall_rating: 4.5,
      strengths: [
        "ユーザーインターフェースの設計が優れている",
        "コードの構造が整理されている",
        "最新の技術スタックを採用している"
      ],
      improvements: [
        "テストカバレッジを増やす",
        "ドキュメンテーションを充実させる",
        "パフォーマンスの最適化"
      ],
      detailed_analysis: "プロジェクトは全体的に優れた品質を示しています。特に、ユーザーインターフェースの設計が直感的で使いやすく、高く評価できます。コードの構造も整理されており、保守性が高いと言えます。最新の技術スタックを採用していることで、現代的な開発手法に精通していることがわかります。"
    }
  end
end
